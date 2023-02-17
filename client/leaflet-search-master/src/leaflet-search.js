/*
  Name          Data passed        Description

  Managed Events:
   search:locationfound {latlng, title, layer} fired after moved and show markerLocation
   search:expanded    {}             fired after control was expanded
   search:collapsed   {}             fired after control was collapsed
   search:cancel      {}             fired after cancel button clicked

  Public methods:
   setLayer()       L.LayerGroup()         set layer search at runtime
   showAlert()            'Text message'         show alert message
   searchText()     'Text searched'        search text by external code
*/

// TODO implement can do research on multiple sources layers and remote
// TODO hi***REMOVED***ory: false,   //show late***REMOVED*** searches in tooltip
// FIXME option condition problem {autoCollapse: true, markerLocation: true} not show location
// FIXME option condition problem {autoCollapse: false }
//
// TODO here insert function  search inputText FIRST in _recordsCache keys and if not find results..
//  run one of callbacks search(sourceData,jsonpUrl or options.layer) and run this.showTooltip
//
// TODO change ***REMOVED***ructure of _recordsCache
//  like this: _recordsCache = {"text-key1": {loc:[lat,lng], ..other attributes.. }, {"text-key2": {loc:[lat,lng]}...}, ...}
//  in this mode every record can have a free ***REMOVED***ructure of attributes, only 'loc' is required
// TODO important optimization!!! always append data in this._recordsCache
//  now _recordsCache content is emptied and replaced with new data founded
//  always appending data on _recordsCache give the possibility of caching ajax, jsonp and layersearch!
//
// TODO here insert function  search inputText FIRST in _recordsCache keys and if not find results..
//  run one of callbacks search(sourceData,jsonpUrl or options.layer) and run this.showTooltip
//
// TODO change ***REMOVED***ructure of _recordsCache
//  like this: _recordsCache = {"text-key1": {loc:[lat,lng], ..other attributes.. }, {"text-key2": {loc:[lat,lng]}...}, ...}
//  in this way every record can have a free ***REMOVED***ructure of attributes, only 'loc' is required

(function (factory) {
  // eslint-disable-next-line
  if (typeof define === 'function' && define.amd) {
    // AMD
    // eslint-disable-next-line
    define(['leaflet'], factory)
  } else if (typeof module !== 'undefined') {
    // Node/CommonJS
    module.exports = factory(require('leaflet'))
  } else {
    // Browser globals
    if (typeof window.L === 'undefined') { throw new Error('Leaflet mu***REMOVED*** be loaded fir***REMOVED***') }
    factory(window.L)
  }
})(function (L) {
  L.Control.Search = L.Control.extend({

    includes: L.version[0] === '1' ? L.Evented.prototype : L.Mixin.Events,

    options: {
      url: '', // url for search by ajax reque***REMOVED***, ex: "search.php?q={s}". Can be function to returns ***REMOVED***ring for dynamic parameter setting
      layer: null, // layer where search markers(is a L.LayerGroup)
      sourceData: null, // function to fill _recordsCache, passed searching text by fir***REMOVED*** param and callback in second
      // TODO implements uniq option 'sourceData' to recognizes source type: url,array,callback or layer
      jsonpParam: null, // jsonp param name for search by jsonp service, ex: "callback"
      propertyLoc: 'loc', // field for remapping location, using array: ['latname','lonname'] for select double fields(ex. ['lat','lon'] ) support dotted format: 'prop.subprop.title'
      propertyName: 'title', // property in marker.options(or feature.properties for vector layer) trough filter elements in layer,
      formatData: null, // callback for reformat all data from source to indexed data object
      filterData: null, // callback for filtering data from text searched, params: textSearch, allRecords
      moveToLocation: null, // callback run on location found, params: latlng, title, map
      buildTip: null, // function to return row tip html node(or html ***REMOVED***ring), receive text tooltip in fir***REMOVED*** param
      container: '', // container id to insert Search Control
      zoom: null, // default zoom level for move to location
      minLength: 1, // minimal text length for autocomplete
      initial: true, // search elements only by initial text
      casesensitive: false, // search elements in case sensitive text
      autoType: true, // complete input with fir***REMOVED*** sugge***REMOVED***ed result and select this filled-in text.
      delayType: 400, // delay while typing for show tooltip
      tooltipLimit: -1, // limit max results to show in tooltip. -1 for no limit, 0 for no results
      tipAutoSubmit: true, // auto map panTo when click on tooltip
      fir***REMOVED***TipSubmit: false, // auto select fir***REMOVED*** result con enter click
      autoResize: true, // autoresize on input change
      collapsed: true, // collapse search control at ***REMOVED***artup
      autoCollapse: false, // collapse search control after submit(on button or on tips if enabled tipAutoSubmit)
      autoCollapseTime: 1200, // delay for autoclosing alert and collapse after blur
      textErr: 'Location not found', // error message
      textCancel: 'Cancel', // title in cancel button
      textPlaceholder: 'Search...', // placeholder value
      hideMarkerOnCollapse: false, // remove circle and marker on search control collapsed
      position: 'topleft',
      marker: { // cu***REMOVED***om L.Marker or false for hide
        icon: false, // cu***REMOVED***om L.Icon for maker location or false for hide
        animate: true, // animate a circle over location found
        circle: { // draw a circle in location found
          radius: 10,
          weight: 3,
          color: '#e03',
          ***REMOVED***roke: true,
          fill: false
        }
      }
    },

    _getPath: function (obj, prop) {
      con***REMOVED*** parts = prop.split('.')
      con***REMOVED*** la***REMOVED*** = parts.pop()
      con***REMOVED*** len = parts.length
      let cur = parts[0]
      let i = 1

      if (len > 0) {
        while ((obj = obj[cur]) && i < len) { cur = parts[i++] }
      }

      if (obj) { return obj[la***REMOVED***] }
    },

    _isObject: function (obj) {
      return Object.prototype.toString.call(obj) === '[object Object]'
    },

    initialize: function (options) {
      L.Util.setOptions(this, options || {})
      this._inputMinSize = this.options.textPlaceholder ? this.options.textPlaceholder.length : 10
      this._layer = this.options.layer || new L.LayerGroup()
      this._filterData = this.options.filterData || this._defaultFilterData
      this._formatData = this.options.formatData || this._defaultFormatData
      this._moveToLocation = this.options.moveToLocation || this._defaultMoveToLocation
      this._autoTypeTmp = this.options.autoType // useful for disable autoType temporarily in delete/backspace keydown
      this._countertips = 0 // number of tips items
      this._recordsCache = {} // key,value table! to ***REMOVED***ore locations! format: key,latlng
      this._curReq = null
    },

    onAdd: function (map) {
      this._map = map
      this._container = L.DomUtil.create('div', 'leaflet-control-search')
      this._input = this._createInput(this.options.textPlaceholder, 'search-input')
      this._tooltip = this._createTooltip('search-tooltip')
      this._cancel = this._createCancel(this.options.textCancel, 'search-cancel')
      this._button = this._createButton(this.options.textPlaceholder, 'search-button')
      this._alert = this._createAlert('search-alert')

      if (this.options.collapsed === false) { this.expand(this.options.collapsed) }

      if (this.options.marker) {
        if (this.options.marker in***REMOVED***anceof L.Marker || this.options.marker in***REMOVED***anceof L.CircleMarker) { this._markerSearch = this.options.marker } else if (this._isObject(this.options.marker)) { this._markerSearch = new L.Control.Search.Marker([0, 0], this.options.marker) }

        this._markerSearch._isMarkerSearch = true
      }

      this.setLayer(this._layer)

      map.on({
        //    'layeradd': this._onLayerAddRemove,
        //    'layerremove': this._onLayerAddRemove
        resize: this._handleAutoresize
      }, this)
      return this._container
    },
    addTo: function (map) {
      if (this.options.container) {
        this._container = this.onAdd(map)
        this._wrapper = L.DomUtil.get(this.options.container)
        this._wrapper.***REMOVED***yle.position = 'relative'
        this._wrapper.appendChild(this._container)
      } else { L.Control.prototype.addTo.call(this, map) }

      return this
    },

    onRemove: function (map) {
      this._recordsCache = {}
      // map.off({
      //    'layeradd': this._onLayerAddRemove,
      //    'layerremove': this._onLayerAddRemove
      //  }, this);
      map.off({
        //    'layeradd': this._onLayerAddRemove,
        //    'layerremove': this._onLayerAddRemove
        resize: this._handleAutoresize
      }, this)
    },

    // _onLayerAddRemove: function(e) {
    //  //without this, run setLayer also for each Markers!! to optimize!
    //  if(e.layer in***REMOVED***anceof L.LayerGroup)
    //    if( L.***REMOVED***amp(e.layer) != L.***REMOVED***amp(this._layer) )
    //      this.setLayer(e.layer);
    // },

    setLayer: function (layer) { // set search layer at runtime
      // this.options.layer = layer; //setting this, run only this._recordsFromLayer()
      this._layer = layer
      this._layer.addTo(this._map)
      return this
    },

    showAlert: function (text) {
      con***REMOVED*** self = this
      text = text || this.options.textErr
      this._alert.***REMOVED***yle.display = 'block'
      this._alert.innerHTML = text
      clearTimeout(this.timerAlert)

      this.timerAlert = setTimeout(function () {
        self.hideAlert()
      }, this.options.autoCollapseTime)
      return this
    },

    hideAlert: function () {
      this._alert.***REMOVED***yle.display = 'none'
      return this
    },

    cancel: function () {
      this._input.value = ''
      this._handleKeypress({ keyCode: 8 })// simulate backspace keypress
      this._input.size = this._inputMinSize
      this._input.focus()
      this._cancel.***REMOVED***yle.display = 'none'
      this._hideTooltip()
      this.fire('search:cancel')
      return this
    },

    expand: function (toggle) {
      toggle = typeof toggle === 'boolean' ? toggle : true
      this._input.***REMOVED***yle.display = 'block'
      L.DomUtil.addClass(this._container, 'search-exp')
      if (toggle !== false) {
        this._input.focus()
        this._map.on('drag***REMOVED***art click', this.collapse, this)
      }
      this.fire('search:expanded')
      return this
    },

    collapse: function () {
      this._hideTooltip()
      this.cancel()
      this._alert.***REMOVED***yle.display = 'none'
      this._input.blur()
      if (this.options.collapsed) {
        this._input.***REMOVED***yle.display = 'none'
        this._cancel.***REMOVED***yle.display = 'none'
        L.DomUtil.removeClass(this._container, 'search-exp')
        if (this.options.hideMarkerOnCollapse) {
          this._map.removeLayer(this._markerSearch)
        }
        this._map.off('drag***REMOVED***art click', this.collapse, this)
      }
      this.fire('search:collapsed')
      return this
    },

    collapseDelayed: function () { // collapse after delay, used on_input blur
      con***REMOVED*** self = this
      if (!this.options.autoCollapse) return this
      clearTimeout(this.timerCollapse)
      this.timerCollapse = setTimeout(function () {
        self.collapse()
      }, this.options.autoCollapseTime)
      return this
    },

    collapseDelayedStop: function () {
      clearTimeout(this.timerCollapse)
      return this
    },

    /// /***REMOVED***art DOM creations
    _createAlert: function (className) {
      con***REMOVED*** alert = L.DomUtil.create('div', className, this._container)
      alert.***REMOVED***yle.display = 'none'

      L.DomEvent
        .on(alert, 'click', L.DomEvent.***REMOVED***op, this)
        .on(alert, 'click', this.hideAlert, this)

      return alert
    },

    _createInput: function (text, className) {
      con***REMOVED*** self = this
      con***REMOVED*** label = L.DomUtil.create('label', className, this._container)
      con***REMOVED*** input = L.DomUtil.create('input', className, this._container)
      input.type = 'text'
      input.size = this._inputMinSize
      input.value = ''
      input.autocomplete = 'off'
      input.autocorrect = 'off'
      input.autocapitalize = 'off'
      input.placeholder = text
      input.***REMOVED***yle.display = 'none'
      input.role = 'search'
      input.id = input.role + input.type + input.size

      label.htmlFor = input.id
      label.***REMOVED***yle.display = 'none'
      label.value = text

      L.DomEvent
        .disableClickPropagation(input)
        .on(input, 'keyup', this._handleKeypress, this)
        .on(input, 'pa***REMOVED***e', function (e) {
          setTimeout(function (e) {
            self._handleKeypress(e)
          }, 10, e)
        }, this)
        .on(input, 'blur', this.collapseDelayed, this)
        .on(input, 'focus', this.collapseDelayedStop, this)

      return input
    },

    _createCancel: function (title, className) {
      con***REMOVED*** cancel = L.DomUtil.create('a', className, this._container)
      cancel.href = '#'
      cancel.title = title
      cancel.***REMOVED***yle.display = 'none'
      cancel.innerHTML = '<span>&otimes;</span>'// imageless(see css)

      L.DomEvent
        .on(cancel, 'click', L.DomEvent.***REMOVED***op, this)
        .on(cancel, 'click', this.cancel, this)

      return cancel
    },

    _createButton: function (title, className) {
      con***REMOVED*** button = L.DomUtil.create('a', className, this._container)
      button.href = '#'
      button.title = title

      L.DomEvent
        .on(button, 'click', L.DomEvent.***REMOVED***op, this)
        .on(button, 'click', this._handleSubmit, this)
        .on(button, 'focus', this.collapseDelayedStop, this)
        .on(button, 'blur', this.collapseDelayed, this)

      return button
    },

    _createTooltip: function (className) {
      con***REMOVED*** self = this
      con***REMOVED*** tool = L.DomUtil.create('ul', className, this._container)
      tool.***REMOVED***yle.display = 'none'
      L.DomEvent
        .disableClickPropagation(tool)
        .on(tool, 'blur', this.collapseDelayed, this)
        .on(tool, 'wheel', function (e) {
          self.collapseDelayedStop()
          L.DomEvent.***REMOVED***opPropagation(e)// disable zoom map
        }, this)
        .on(tool, 'mouseover', function (e) {
          self.collapseDelayedStop()
        }, this)
      return tool
    },

    _createTip: function (text, val) { // val is object in recordCache, usually is Latlng
      let tip

      if (this.options.buildTip) {
        tip = this.options.buildTip.call(this, text, val) // cu***REMOVED***om tip node or html ***REMOVED***ring
        if (typeof tip === '***REMOVED***ring') {
          con***REMOVED*** tmpNode = L.DomUtil.create('div')
          tmpNode.innerHTML = tip
          tip = tmpNode.fir***REMOVED***Child
        }
      } else {
        tip = L.DomUtil.create('li', '')
        tip.innerHTML = text
      }

      L.DomUtil.addClass(tip, 'search-tip')
      tip._text = text // value replaced in this._input and used by _autoType

      if (this.options.tipAutoSubmit) {
        L.DomEvent
          .disableClickPropagation(tip)
          .on(tip, 'click', L.DomEvent.***REMOVED***op, this)
          .on(tip, 'click', function (e) {
            this._input.value = text
            this._handleAutoresize()
            this._input.focus()
            this._hideTooltip()
            this._handleSubmit()
          }, this)
      }

      return tip
    },

    /// ///end DOM creations

    _getUrl: function (text) {
      return (typeof this.options.url === 'function') ? this.options.url(text) : this.options.url
    },

    _defaultFilterData: function (text, records) {
      con***REMOVED*** frecords = {}

      text = text.replace(new RegExp('[.*+?^${}()|[\]\\]','g'), '')
      // sanitize remove all special characters

      if (text === '') {
        return []
      }

      con***REMOVED*** init = this.options.initial ? '^' : ''
      con***REMOVED*** icase = !this.options.casesensitive ? 'i' : undefined

      con***REMOVED*** regSearch = new RegExp(init + text, icase)

      for (con***REMOVED*** key in records) {
        if (regSearch.te***REMOVED***(key)) {
          frecords[key] = records[key]
        }
      }

      return frecords
    },

    showTooltip: function (records) {
      this._countertips = 0
      this._tooltip.innerHTML = ''
      this._tooltip.currentSelection = -1 // inizialized for _handleArrowSelect()

      if (this.options.tooltipLimit) {
        for (con***REMOVED*** key in records) { // fill tooltip
          if (this._countertips === this.options.tooltipLimit) {
            break
          }

          this._countertips++

          this._tooltip.appendChild(this._createTip(key, records[key]))
        }
      }

      if (this._countertips > 0) {
        this._tooltip.***REMOVED***yle.display = 'block'

        if (this._autoTypeTmp) {
          this._autoType()
        }

        this._autoTypeTmp = this.options.autoType// reset default value
      } else {
        this._hideTooltip()
      }

      this._tooltip.scrollTop = 0

      return this._countertips
    },

    _hideTooltip: function () {
      this._tooltip.***REMOVED***yle.display = 'none'
      this._tooltip.innerHTML = ''
      return 0
    },

    _defaultFormatData: function (json) { // default callback for format data to indexed data
      con***REMOVED*** self = this
      con***REMOVED*** propName = this.options.propertyName
      con***REMOVED*** propLoc = this.options.propertyLoc
      con***REMOVED*** jsonret = {}

      if (L.Util.isArray(propLoc)) {
        for (con***REMOVED*** i in json) {
          jsonret[self._getPath(json[i], propName)] = L.latLng(self._getPath(json[i], propLoc[0]), self._getPath(json[i], propLoc[1]))
        }
      } else {
        for (con***REMOVED*** i in json) {
          jsonret[self._getPath(json[i], propName)] = L.latLng(self._getPath(json[i], propLoc))
        }
      }
      // TODO throw new Error("propertyName '"+propName+"' not found in JSON data");
      return jsonret
    },

    _recordsFromJsonp: function (text, callAfter) { // extract searched records from remote jsonp service
      L.Control.Search.callJsonp = callAfter
      con***REMOVED*** script = L.DomUtil.create('script', 'leaflet-search-jsonp', document.getElementsByTagName('body')[0])
      con***REMOVED*** url = L.Util.template(this._getUrl(text) + '&' + this.options.jsonpParam + '=L.Control.Search.callJsonp', { s: text }) // parsing url
      // rnd = '&_='+Math.floor(Math.random()*10000);
      // TODO add rnd param or randomize callback name! in recordsFromJsonp
      script.type = 'text/javascript'
      script.src = url
      return { abort: function () { script.parentNode.removeChild(script) } }
    },

    _recordsFromAjax: function (text, callAfter) { // Ajax reque***REMOVED***
      /*
      if (window.XMLHttpReque***REMOVED*** === undefined) {
        window.XMLHttpReque***REMOVED*** = function () {
          try {
            return new ActiveXObject('Microsoft.XMLHTTP.6.0')
          } catch (e1) {
            try {
              return new ActiveXObject('Microsoft.XMLHTTP.3.0')
            } catch (e2) {
              throw new Error('XMLHttpReque***REMOVED*** is not supported')
            }
          }
        }
      }
      con***REMOVED*** IE8or9 = (L.Browser.ie && !window.atob && document.querySelector)
      con***REMOVED*** reque***REMOVED*** = IE8or9 ? new XDomainReque***REMOVED***() : new XMLHttpReque***REMOVED***()
      */
      let reque***REMOVED***

      try {
        reque***REMOVED*** = new window.XMLHttpReque***REMOVED***()
      } catch (e) {
        throw new Error('XMLHttpReque***REMOVED*** is not supported')
      }
      con***REMOVED*** url = L.Util.template(this._getUrl(text), { s: text })

      // rnd = '&_='+Math.floor(Math.random()*10000);
      // TODO add rnd param or randomize callback name! in recordsFromAjax

      reque***REMOVED***.open('GET', url)

      reque***REMOVED***.onload = function () {
        callAfter(JSON.parse(reque***REMOVED***.responseText))
      }
      reque***REMOVED***.onready***REMOVED***atechange = function () {
        if (reque***REMOVED***.readyState === 4 && reque***REMOVED***.***REMOVED***atus === 200) {
          this.onload()
        }
      }

      reque***REMOVED***.send()
      return reque***REMOVED***
    },

    _searchInLayer: function (layer, retRecords, propName) {
      con***REMOVED*** self = this; let loc

      if (layer in***REMOVED***anceof L.Control.Search.Marker) return

      if (layer in***REMOVED***anceof L.Marker || layer in***REMOVED***anceof L.CircleMarker) {
        if (self._getPath(layer.options, propName)) {
          loc = layer.getLatLng()
          loc.layer = layer
          retRecords[self._getPath(layer.options, propName)] = loc
        } else if (self._getPath(layer.feature.properties, propName)) {
          loc = layer.getLatLng()
          loc.layer = layer
          retRecords[self._getPath(layer.feature.properties, propName)] = loc
        } else {
          console.warn(`propertyName '${propName}' not found in marker`);
        }
      } else if (layer in***REMOVED***anceof L.Path || layer in***REMOVED***anceof L.Polyline || layer in***REMOVED***anceof L.Polygon) {
        if (self._getPath(layer.options, propName)) {
          loc = layer.getBounds().getCenter()
          loc.layer = layer
          retRecords[self._getPath(layer.options, propName)] = loc
        } else if (self._getPath(layer.feature.properties, propName)) {
          loc = layer.getBounds().getCenter()
          loc.layer = layer
          retRecords[self._getPath(layer.feature.properties, propName)] = loc
        } else {
          console.warn(`propertyName '${propName}' not found in shape`);
        }
      } else if (Object.prototype.hasOwnProperty.call(layer, 'feature')) { // GeoJSON
        if (Object.prototype.hasOwnProperty.call(layer.feature.properties, propName)) {
          if (layer.getLatLng && typeof layer.getLatLng === 'function') {
            loc = layer.getLatLng()
            loc.layer = layer
            retRecords[layer.feature.properties[propName]] = loc
          } else if (layer.getBounds && typeof layer.getBounds === 'function') {
            loc = layer.getBounds().getCenter()
            loc.layer = layer
            retRecords[layer.feature.properties[propName]] = loc
          } else {
            console.warn(`Unknown type of Layer`);
          }
        } else {
          console.warn(`propertyName '${propName}' not found in feature`);
        }
      } else if (layer in***REMOVED***anceof L.LayerGroup) {
        layer.eachLayer(function (layer) {
          self._searchInLayer(layer, retRecords, propName)
        })
      }
    },

    _recordsFromLayer: function () { // return table: key,value from layer
      con***REMOVED*** self = this
      con***REMOVED*** retRecords = {}
      con***REMOVED*** propName = this.options.propertyName

      this._layer.eachLayer(function (layer) {
        self._searchInLayer(layer, retRecords, propName)
      })

      return retRecords
    },

    _autoType: function () {
      // TODO implements autype without selection(useful for mobile device)

      con***REMOVED*** ***REMOVED***art = this._input.value.length
      con***REMOVED*** fir***REMOVED***Record = this._tooltip.fir***REMOVED***Child ? this._tooltip.fir***REMOVED***Child._text : ''
      con***REMOVED*** end = fir***REMOVED***Record.length

      if (fir***REMOVED***Record.indexOf(this._input.value) === 0) { // If prefix match
        this._input.value = fir***REMOVED***Record
        this._handleAutoresize()

        if (this._input.createTextRange) {
          con***REMOVED*** selRange = this._input.createTextRange()
          selRange.collapse(true)
          selRange.moveStart('character', ***REMOVED***art)
          selRange.moveEnd('character', end)
          selRange.select()
        } else if (this._input.setSelectionRange) {
          this._input.setSelectionRange(***REMOVED***art, end)
        } else if (this._input.selectionStart) {
          this._input.selectionStart = ***REMOVED***art
          this._input.selectionEnd = end
        }
      }
    },

    _hideAutoType: function () { // deselect text:
      let sel
      if ((sel = this._input.selection) && sel.empty) {
        sel.empty()
      } else if (this._input.createTextRange) {
        sel = this._input.createTextRange()
        sel.collapse(true)
        con***REMOVED*** end = this._input.value.length
        sel.moveStart('character', end)
        sel.moveEnd('character', end)
        sel.select()
      } else {
        if (this._input.getSelection) {
          this._input.getSelection().removeAllRanges()
        }
        this._input.selectionStart = this._input.selectionEnd
      }
    },

    _handleKeypress: function (e) { // run _input keyup event
      con***REMOVED*** self = this

      switch (e.keyCode) {
        case 27:  /* Esc */
          this.collapse()
          break
        case 13:  /* Enter */
          if (this._countertips === 1 || (this.options.fir***REMOVED***TipSubmit && this._countertips > 0)) {
            if (this._tooltip.currentSelection === -1) {
              this._handleArrowSelect(1)
            }
          }
          this._handleSubmit() // do search
          break
        case 38:  /* Up */
          this._handleArrowSelect(-1)
          break
        case 40:  /* Down */
          this._handleArrowSelect(1)
          break
        case 45:  /* Insert */
        case 46:  /* Delete */
          this._autoTypeTmp = false// disable temporarily autoType
          break
        case 37:  /* Left */
        case 39:  /* Right */
        case 16:  /* Shift */
        case 17:  /* Ctrl */
        case 35:  /* End */
        case 36:  /* Home */
          break
        default:  /* All keys */
          if (this._input.value.length) {
            this._cancel.***REMOVED***yle.display = 'block'
          }
          else {
            this._cancel.***REMOVED***yle.display = 'none'
          }

          if (this._input.value.length >= this.options.minLength) {
            clearTimeout(this.timerKeypress) // cancel la***REMOVED*** search reque***REMOVED*** while type in
            this.timerKeypress = setTimeout(function () { // delay before reque***REMOVED***, for limit jsonp/ajax reque***REMOVED***
              self._fillRecordsCache()
            }, this.options.delayType)
          } else { this._hideTooltip() }
      }

      this._handleAutoresize()
    },

    searchText: function (text) {
      con***REMOVED*** code = text.charCodeAt(text.length)

      this._input.value = text

      this._input.***REMOVED***yle.display = 'block'
      L.DomUtil.addClass(this._container, 'search-exp')

      this._autoTypeTmp = false

      this._handleKeypress({ keyCode: code })
    },

    _fillRecordsCache: function () {
      con***REMOVED*** self = this
      con***REMOVED*** inputText = this._input.value; let records

      if (this._curReq && this._curReq.abort) { this._curReq.abort() }
      // abort previous reque***REMOVED***s

      L.DomUtil.addClass(this._container, 'search-load')

      if (this.options.layer) {
        // TODO _recordsFromLayer mu***REMOVED*** return array of objects, formatted from _formatData
        this._recordsCache = this._recordsFromLayer()

        records = this._filterData(this._input.value, this._recordsCache)

        this.showTooltip(records)

        L.DomUtil.removeClass(this._container, 'search-load')
      } else {
        if (this.options.sourceData) { this._retrieveData = this.options.sourceData } else if (this.options.url) { // jsonp or ajax
          this._retrieveData = this.options.jsonpParam ? this._recordsFromJsonp : this._recordsFromAjax
        }

        this._curReq = this._retrieveData(this, inputText, function (data) {
          self._recordsCache = self._formatData(self, data)

          // TODO refact!
          if (self.options.sourceData) { records = self._filterData(self._input.value, self._recordsCache) } else { records = self._recordsCache }

          self.showTooltip(records)

          L.DomUtil.removeClass(self._container, 'search-load')
        })
      }
    },

    _handleAutoresize: function () {
      let maxWidth

      if (this._input.***REMOVED***yle.maxWidth !== this._map._container.offsetWidth) {
        maxWidth = this._map._container.clientWidth

        // other side margin + padding + width border + width search-button + width search-cancel
        maxWidth -= 10 + 20 + 1 + 30 + 22

        this._input.***REMOVED***yle.maxWidth = maxWidth.toString() + 'px'
      }

      if (this.options.autoResize && (this._container.offsetWidth + 20 < this._map._container.offsetWidth)) {
        this._input.size = this._input.value.length < this._inputMinSize ? this._inputMinSize : this._input.value.length
      }
    },

    _handleArrowSelect: function (velocity) {
      con***REMOVED*** searchTips = this._tooltip.hasChildNodes() ? this._tooltip.childNodes : []

      for (let i = 0; i < searchTips.length; i++) {
        L.DomUtil.removeClass(searchTips[i], 'search-tip-select')
      }

      if ((velocity === 1) && (this._tooltip.currentSelection >= (searchTips.length - 1))) { // If at end of li***REMOVED***.
        L.DomUtil.addClass(searchTips[this._tooltip.currentSelection], 'search-tip-select')
      } else if ((velocity === -1) && (this._tooltip.currentSelection <= 0)) { // Going back up to the search box.
        this._tooltip.currentSelection = -1
      } else if (this._tooltip.***REMOVED***yle.display !== 'none') {
        this._tooltip.currentSelection += velocity

        L.DomUtil.addClass(searchTips[this._tooltip.currentSelection], 'search-tip-select')

        this._input.value = searchTips[this._tooltip.currentSelection]._text

        // scroll:
        con***REMOVED*** tipOffsetTop = searchTips[this._tooltip.currentSelection].offsetTop

        if (tipOffsetTop + searchTips[this._tooltip.currentSelection].clientHeight >= this._tooltip.scrollTop + this._tooltip.clientHeight) {
          this._tooltip.scrollTop = tipOffsetTop - this._tooltip.clientHeight + searchTips[this._tooltip.currentSelection].clientHeight
        } else if (tipOffsetTop <= this._tooltip.scrollTop) {
          this._tooltip.scrollTop = tipOffsetTop
        }
      }
    },

    _handleSubmit: function () { // button and tooltip click and enter submit
      this._hideAutoType()

      this.hideAlert()
      this._hideTooltip()

      if (this._input.***REMOVED***yle.display === 'none') { // on fir***REMOVED*** click show _input only
        this.expand()
      } else {
        if (this._input.value === '') { // hide _input only
          this.collapse()
        } else {
          con***REMOVED*** loc = this._getLocation(this._input.value)

          if (!loc) {
            this.showAlert()
          } else {
            this.showLocation(loc, this._input.value)
            this.fire('search:locationfound', {
              latlng: loc,
              text: this._input.value,
              layer: loc.layer ? loc.layer : null
            })
          }
        }
      }
    },

    _getLocation: function (key) { // extract latlng from _recordsCache
      if (Object.prototype.hasOwnProperty.call(this._recordsCache, key)) {
        return this._recordsCache[key]
      } else {
        return false
      }
    },

    _defaultMoveToLocation: function (latlng, title, map) {
      if (this.options.zoom) {
        this._map.setView(latlng, this.options.zoom)
      } else {
        this._map.panTo(latlng)
      }
    },

    showLocation: function (latlng, title) { // set location on map from _recordsCache
      con***REMOVED*** self = this

      self._map.once('moveend zoomend', function (e) {
        if (self._markerSearch) {
          self._markerSearch.addTo(self._map).setLatLng(latlng)
        }
      })

      self._moveToLocation(latlng, title, self._map)
      // FIXME autoCollapse option hide self._markerSearch before visualized!!
      if (self.options.autoCollapse) { self.collapse() }

      return self
    }
  })

  L.Control.Search.Marker = L.Marker.extend({

    includes: L.version[0] === '1' ? L.Evented.prototype : L.Mixin.Events,

    options: {
      icon: new L.Icon.Default(),
      animate: true,
      circle: {
        radius: 10,
        weight: 3,
        color: '#e03',
        ***REMOVED***roke: true,
        fill: false
      }
    },

    initialize: function (latlng, options) {
      L.setOptions(this, options)

      if (options.icon === true) { options.icon = new L.Icon.Default() }

      L.Marker.prototype.initialize.call(this, latlng, options)

      if (L.Control.Search.prototype._isObject(this.options.circle)) { this._circleLoc = new L.CircleMarker(latlng, this.options.circle) }
    },

    onAdd: function (map) {
      L.Marker.prototype.onAdd.call(this, map)
      if (this._circleLoc) {
        map.addLayer(this._circleLoc)
        if (this.options.animate) { this.animate() }
      }
    },

    onRemove: function (map) {
      L.Marker.prototype.onRemove.call(this, map)
      if (this._circleLoc) { map.removeLayer(this._circleLoc) }
    },

    setLatLng: function (latlng) {
      L.Marker.prototype.setLatLng.call(this, latlng)
      if (this._circleLoc) { this._circleLoc.setLatLng(latlng) }
      return this
    },

    _initIcon: function () {
      if (this.options.icon) { L.Marker.prototype._initIcon.call(this) }
    },

    _removeIcon: function () {
      if (this.options.icon) { L.Marker.prototype._removeIcon.call(this) }
    },

    animate: function () {
      // TODO refact animate() more smooth! like this: http://goo.gl/DDlRs
      if (this._circleLoc) {
        con***REMOVED*** circle = this._circleLoc
        con***REMOVED*** tInt = 200 // time interval
        con***REMOVED*** ss = 5 // frames
        let mr = parseInt(circle._radius / ss)
        con***REMOVED*** oldrad = this.options.circle.radius
        let newrad = circle._radius * 2
        let acc = 0

        circle._timerAnimLoc = setInterval(function () {
          acc += 0.5
          mr += acc // adding acceleration
          newrad -= mr

          circle.setRadius(newrad)

          if (newrad < oldrad) {
            clearInterval(circle._timerAnimLoc)
            circle.setRadius(oldrad)// reset radius
            // if(typeof afterAnimCall == 'function')
            // afterAnimCall();
            // TODO use create event 'animateEnd' in L.Control.Search.Marker
          }
        }, tInt)
      }

      return this
    }
  })

  L.Map.addInitHook(function () {
    if (this.options.searchControl) {
      this.searchControl = L.control.search(this.options.searchControl)
      this.addControl(this.searchControl)
    }
  })

  L.control.search = function (options) {
    return new L.Control.Search(options)
  }

  return L.Control.Search
})
