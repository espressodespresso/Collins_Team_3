API ENDPOINTS
-------------
/POST login\
Body: {username: <***REMOVED***ring>, password: <***REMOVED***ring>}\
Description: 200 response sends a jwt to be used in reque***REMOVED***s to /api endpoints\
  
/GET api/products/scenes\
Headers: Authorization : Bearer <token>\
Description: Sends a li***REMOVED*** of all the scene ids for a user\

/POST /api/products\
Headers: Authorization : Bearer <token>\
Body: {products: <li***REMOVED***<productIds>>}\
Description: Sends a li***REMOVED*** of all products corresponding with the productIds\

/GET /api/missions\
Headers: Authorization : Bearer <token>\
Description: Sends a li***REMOVED*** of all the mission ids for a user\
  
/GET /api/missions/<missionId>\
Headers: Authorization : Bearer <token>\
Description: Sends the metadata for the mission with the given missionid\
  
/GET /api/missions/<missionId>\
Headers: Authorization : Bearer <token>\
Description: Sends the metadata for the mission with the given missionid\
  
/GET /api/missions/<missionId>/footrpint\
Headers: Authorization : Bearer <token>\
Description: Sends the footprint for the mission with the given missionid\

Loading Sequence
1. /POST login
  
2. /GET /api/products/scenes
  
3. Use scene ids from result of 2, and send to /POST /api/products
  
4. Use results of 3 to render in scenes on map. Results of 3 can also be used to get all the missionIds since each scene product comes with its missionId.
  
5. Reque***REMOVED*** meta data and footprint for each mission using /GET /api/mission/<missionid> and /GET /api/mission/<missionid>/footprint
  
