var map = L.map('map', {zoomControl: false}).setView([54.247468, -4.438477], 6);

L.tileLayer('https://tile.open***REMOVED***reetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.open***REMOVED***reetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var options = {
    position: 'bottomright',
    drawMarker: true,
    drawPolyline: true,
    drawRectangle: true,
    drawCircle: true,
    cutPolygon: true,
    editMode: true,
    rmovalMode: true,
};

map.pm.addControls(options);
map.pm.disableDraw('Poly');
map.on('pm:create', function (e) {
    console.log(e);
    e.shape;
    e.layer;
});


con***REMOVED*** bigLi***REMOVED*** = async () => {
    con***REMOVED*** response = await fetch('./server/servies/missions.js');
    con***REMOVED*** myJson = await response.json(); //extract JSON from the http response
    // do something with myJson
  }

/*
var object = {
    "type": "Feature",
    "geometry": {
"type":"MultiPolygon","coordinates":[[[[-4.671,50.581],[-4.677,50.581],[-4.679,50.626],[-4.672,50.626],[-4.666,50.626],[-4.665,50.626],[-4.66,50.626],[-4.659,50.626],[-4.653,50.626],[-4.647,50.626],[-4.646,50.626],[-4.64,50.626],[-4.634,50.626],[-4.633,50.626],[-4.628,50.626],[-4.621,50.627],[-4.615,50.627],[-4.614,50.627],[-4.609,50.627],[-4.608,50.627],[-4.602,50.627],[-4.596,50.627],[-4.595,50.627],[-4.59,50.627],[-4.589,50.627],[-4.583,50.627],[-4.577,50.627],[-4.576,50.627],[-4.571,50.627],[-4.57,50.627],[-4.564,50.627],[-4.563,50.627],[-4.558,50.627],[-4.557,50.627],[-4.551,50.627],[-4.544996835,50.627857595],[-4.545,50.628],[-4.544,50.628],[-4.539,50.628],[-4.538,50.628],[-4.532,50.628],[-4.526,50.628],[-4.525,50.628],[-4.52,50.628],[-4.519,50.628],[-4.513,50.628],[-4.507,50.628],[-4.506,50.628],[-4.501,50.628],[-4.5,50.628],[-4.494,50.628],[-4.488,50.628],[-4.487,50.628],[-4.482,50.628],[-4.481,50.628],[-4.475,50.628],[-4.468993691,50.628858044],[-4.469,50.629],[-4.468,50.629],[-4.462,50.629],[-4.456,50.629],[-4.455,50.629],[-4.45,50.629],[-4.449,50.629],[-4.443,50.629],[-4.437,50.629],[-4.436,50.629],[-4.431,50.629],[-4.43,50.629],[-4.424,50.629],[-4.418,50.629],[-4.417,50.629],[-4.412,50.629],[-4.411,50.629],[-4.405,50.629],[-4.404,50.629],[-4.398,50.629],[-4.397,50.584],[-4.403,50.584],[-4.404,50.584],[-4.409,50.584],[-4.41,50.584],[-4.416,50.584],[-4.417,50.584],[-4.422,50.584],[-4.423,50.584],[-4.429,50.584],[-4.435,50.584],[-4.436,50.584],[-4.441,50.584],[-4.442,50.584],[-4.448,50.584],[-4.454,50.584],[-4.455,50.584],[-4.46,50.584],[-4.461,50.584],[-4.467,50.584],[-4.473,50.584],[-4.479006309,50.583141956],[-4.479,50.583],[-4.48,50.583],[-4.486,50.583],[-4.492,50.583],[-4.493,50.583],[-4.498,50.583],[-4.499,50.583],[-4.505,50.583],[-4.506,50.583],[-4.511,50.583],[-4.512,50.583],[-4.518,50.583],[-4.524,50.583],[-4.525,50.583],[-4.53,50.583],[-4.531,50.583],[-4.537,50.583],[-4.543,50.583],[-4.544,50.583],[-4.549,50.583],[-4.556,50.582],[-4.562,50.582],[-4.563,50.582],[-4.568,50.582],[-4.569,50.582],[-4.575,50.582],[-4.581,50.582],[-4.582,50.582],[-4.587,50.582],[-4.588,50.582],[-4.594,50.582],[-4.6,50.582],[-4.601,50.582],[-4.606,50.582],[-4.607,50.582],[-4.613,50.582],[-4.614,50.582],[-4.619,50.582],[-4.626,50.581],[-4.632,50.581],[-4.633,50.581],[-4.638,50.581],[-4.639,50.581],[-4.645,50.581],[-4.651,50.581],[-4.652,50.581],[-4.657,50.581],[-4.658,50.581],[-4.664,50.581],[-4.67,50.581],[-4.671,50.581]]],[[[-1.826,51.358],[-1.827,51.358],[-1.833,51.358],[-1.834,51.358],[-1.839,51.358],[-1.84,51.358],[-1.846,51.358],[-1.847,51.358],[-1.846993691,51.358141956],[-1.853,51.359],[-1.859,51.359],[-1.86,51.359],[-1.865,51.359],[-1.866,51.359],[-1.872,51.359],[-1.878,51.359],[-1.879,51.359],[-1.885,51.359],[-1.892,51.359],[-1.891,51.404],[-1.884,51.404],[-1.878,51.404],[-1.877,51.404],[-1.871,51.404],[-1.865,51.404],[-1.864,51.404],[-1.858,51.404],[-1.851,51.403],[-1.845,51.403],[-1.839,51.403],[-1.838,51.403],[-1.833,51.403],[-1.832,51.403],[-1.826,51.403],[-1.825,51.403],[-1.82,51.403],[-1.819,51.403],[-1.813,51.403],[-1.812,51.403],[-1.807,51.403],[-1.806,51.403],[-1.8,51.403],[-1.799,51.403],[-1.794,51.403],[-1.793,51.403],[-1.787,51.403],[-1.78,51.403],[-1.781,51.358],[-1.788,51.358],[-1.794,51.358],[-1.795,51.358],[-1.801,51.358],[-1.807,51.358],[-1.808,51.358],[-1.814,51.358],[-1.82,51.358],[-1.821,51.358],[-1.826,51.358]]],[[[-0.425008264,53.512876033],[-0.418,53.512],[-0.421,53.468],[-0.428,53.468],[-0.434,53.468],[-0.435,53.468],[-0.441,53.468],[-0.442,53.468],[-0.448,53.468],[-0.449,53.468],[-0.455,53.468],[-0.456,53.468],[-0.462,53.468],[-0.469,53.469],[-0.475,53.469],[-0.476,53.469],[-0.482,53.469],[-0.483,53.469],[-0.489,53.469],[-0.495,53.469],[-0.496,53.469],[-0.502,53.469],[-0.503,53.469],[-0.509,53.469],[-0.51,53.469],[-0.509990566,53.469141509],[-0.516,53.47],[-0.522,53.47],[-0.523,53.47],[-0.529,53.47],[-0.53,53.47],[-0.536,53.47],[-0.537,53.47],[-0.543,53.47],[-0.544,53.47],[-0.55,53.47],[-0.556,53.47],[-0.557,53.47],[-0.556994475,53.470124309],[-0.564,53.471],[-0.57,53.471],[-0.571,53.471],[-0.577,53.471],[-0.583,53.471],[-0.584,53.471],[-0.59,53.471],[-0.591,53.471],[-0.597,53.471],[-0.598,53.471],[-0.604,53.471],[-0.605,53.471],[-0.604990566,53.471141509],[-0.611,53.472],[-0.617,53.472],[-0.618,53.472],[-0.624,53.472],[-0.625,53.472],[-0.631,53.472],[-0.632,53.472],[-0.638,53.472],[-0.636,53.517],[-0.629,53.517],[-0.628,53.517],[-0.622,53.517],[-0.616,53.517],[-0.615,53.517],[-0.615005525,53.516875691],[-0.608,53.516],[-0.602,53.516],[-0.601,53.516],[-0.595,53.516],[-0.594,53.516],[-0.588,53.516],[-0.582,53.516],[-0.581,53.516],[-0.575,53.516],[-0.574,53.516],[-0.568,53.516],[-0.567,53.516],[-0.567009434,53.515858491],[-0.561066038,53.515009434],[-0.561,53.516],[-0.554,53.515],[-0.548,53.515],[-0.547,53.515],[-0.541,53.515],[-0.54,53.515],[-0.534,53.515],[-0.533,53.515],[-0.527,53.515],[-0.521,53.515],[-0.52,53.515],[-0.514,53.515],[-0.513,53.515],[-0.513008264,53.514876033],[-0.506,53.514],[-0.5,53.514],[-0.494,53.514],[-0.493,53.514],[-0.487,53.514],[-0.486,53.514],[-0.48,53.514],[-0.479,53.514],[-0.473,53.514],[-0.472,53.514],[-0.466,53.514],[-0.459,53.513],[-0.453,53.513],[-0.452,53.513],[-0.446,53.513],[-0.445,53.513],[-0.439,53.513],[-0.432,53.513],[-0.426,53.513],[-0.425,53.513],[-0.425008264,53.512876033]]],[[[-0.297,53.885],[-0.303,53.885],[-0.308962145,53.885851735],[-0.309,53.885],[-0.317,53.886],[-0.323,53.886],[-0.324,53.886],[-0.33,53.886],[-0.331,53.886],[-0.337,53.886],[-0.338,53.886],[-0.344,53.886],[-0.351,53.886],[-0.358,53.887],[-0.364,53.887],[-0.365,53.887],[-0.371,53.887],[-0.372,53.887],[-0.378,53.887],[-0.379,53.887],[-0.385,53.887],[-0.392,53.887],[-0.398,53.887],[-0.399,53.887],[-0.398991736,53.887123967],[-0.406,53.888],[-0.412,53.888],[-0.413,53.888],[-0.419,53.888],[-0.42,53.888],[-0.426,53.888],[-0.427,53.888],[-0.433,53.888],[-0.431,53.933],[-0.424,53.933],[-0.423,53.933],[-0.417,53.933],[-0.416,53.933],[-0.41,53.933],[-0.409,53.933],[-0.403,53.933],[-0.402,53.933],[-0.402009434,53.932858491],[-0.396,53.932],[-0.39,53.932],[-0.389,53.932],[-0.383,53.932],[-0.382,53.932],[-0.376,53.932],[-0.375,53.932],[-0.369,53.932],[-0.368,53.932],[-0.362,53.932],[-0.361,53.932],[-0.361009434,53.931858491],[-0.355,53.931],[-0.348,53.931],[-0.342,53.931],[-0.341,53.931],[-0.335,53.931],[-0.334,53.931],[-0.328,53.931],[-0.327,53.931],[-0.321,53.931],[-0.32,53.931],[-0.314,53.931],[-0.313,53.931],[-0.313009434,53.930858491],[-0.307,53.93],[-0.301,53.93],[-0.3,53.93],[-0.294,53.93],[-0.293,53.93],[-0.287,53.93],[-0.286,53.93],[-0.279,53.93],[-0.282,53.885],[-0.289,53.885],[-0.29,53.885],[-0.296,53.885],[-0.297,53.885]]],[[[-4.375,55.89],[-4.376,55.935],[-4.369,55.935],[-4.368,55.935],[-4.362,55.935],[-4.361,55.935],[-4.355,55.935],[-4.354,55.935],[-4.348,55.935],[-4.347,55.935],[-4.34,55.935],[-4.333,55.935],[-4.332,55.935],[-4.326,55.935],[-4.325,55.935],[-4.319,55.935],[-4.311994475,55.935875691],[-4.312,55.936],[-4.311,55.936],[-4.304,55.936],[-4.297,55.936],[-4.296,55.936],[-4.29,55.936],[-4.289,55.936],[-4.283,55.936],[-4.282,55.936],[-4.276,55.936],[-4.275,55.936],[-4.268,55.936],[-4.261,55.936],[-4.26,55.936],[-4.254,55.936],[-4.253,55.936],[-4.247,55.936],[-4.246,55.936],[-4.24,55.936],[-4.239,55.936],[-4.232,55.936],[-4.225,55.936],[-4.224,55.936],[-4.217,55.936],[-4.216,55.892],[-4.22300277,55.891124654],[-4.223,55.891],[-4.224,55.891],[-4.23,55.891],[-4.231,55.891],[-4.237,55.891],[-4.238,55.891],[-4.245,55.891],[-4.252,55.891],[-4.253,55.891],[-4.259,55.891],[-4.26,55.891],[-4.266,55.891],[-4.267,55.891],[-4.273,55.891],[-4.274,55.891],[-4.28,55.891],[-4.281,55.891],[-4.288,55.891],[-4.295,55.891],[-4.296,55.891],[-4.302,55.891],[-4.303,55.891],[-4.309,55.891],[-4.31,55.891],[-4.316,55.891],[-4.324,55.89],[-4.331,55.89],[-4.332,55.89],[-4.338,55.89],[-4.339,55.89],[-4.345,55.89],[-4.346,55.89],[-4.352,55.89],[-4.353,55.89],[-4.36,55.89],[-4.367,55.89],[-4.368,55.89],[-4.375,55.89]]],[[[-1.288,56.118],[-1.295,56.118],[-1.296,56.118],[-1.302,56.118],[-1.303,56.118],[-1.309,56.118],[-1.31,56.118],[-1.309994475,56.118124309],[-1.317,56.119],[-1.324,56.119],[-1.325,56.119],[-1.331,56.119],[-1.332,56.119],[-1.338,56.119],[-1.339,56.119],[-1.346,56.119],[-1.353,56.119],[-1.354,56.119],[-1.36,56.119],[-1.361,56.119],[-1.367,56.119],[-1.368,56.119],[-1.375,56.119],[-1.373,56.164],[-1.366,56.164],[-1.365,56.164],[-1.359,56.164],[-1.358,56.164],[-1.352,56.164],[-1.351,56.164],[-1.344,56.164],[-1.337,56.164],[-1.336,56.164],[-1.33,56.164],[-1.329,56.164],[-1.323,56.164],[-1.322,56.164],[-1.322005525,56.163875691],[-1.315,56.163],[-1.308,56.163],[-1.307,56.163],[-1.301,56.163],[-1.3,56.163],[-1.294,56.163],[-1.293,56.163],[-1.287,56.163],[-1.286,56.163],[-1.279,56.163],[-1.278,56.163],[-1.271,56.163],[-1.273,56.118],[-1.28,56.118],[-1.281,56.118],[-1.288,56.118]]],[[[-1.537,57.247],[-1.538,57.247],[-1.545,57.247],[-1.552,57.247],[-1.553,57.247],[-1.559,57.247],[-1.56,57.247],[-1.567,57.247],[-1.568,57.247],[-1.567994475,57.247124309],[-1.575,57.248],[-1.583,57.248],[-1.581,57.293],[-1.573,57.292],[-1.566,57.292],[-1.565,57.292],[-1.559,57.292],[-1.558,57.292],[-1.551,57.292],[-1.55,57.292],[-1.544,57.292],[-1.543,57.292],[-1.536,57.292],[-1.535,57.292],[-1.529,57.292],[-1.528,57.292],[-1.52,57.292],[-1.522,57.247],[-1.53,57.247],[-1.537,57.247]]],[[[-0.647,57.302],[-0.648,57.302],[-0.654,57.302],[-0.655,57.302],[-0.654992647,57.302110294],[-0.663,57.303],[-0.669,57.303],[-0.67,57.303],[-0.677,57.303],[-0.678,57.303],[-0.684,57.303],[-0.685,57.303],[-0.692,57.303],[-0.693,57.303],[-0.699,57.303],[-0.7,57.303],[-0.707,57.303],[-0.715,57.304],[-0.722,57.304],[-0.729,57.304],[-0.73,57.304],[-0.736,57.304],[-0.737,57.304],[-0.744,57.304],[-0.745,57.304],[-0.751,57.304],[-0.752,57.304],[-0.759,57.304],[-0.76,57.304],[-0.766,57.304],[-0.767,57.304],[-0.766992647,57.304110294],[-0.775,57.305],[-0.781,57.305],[-0.782,57.305],[-0.789,57.305],[-0.79,57.305],[-0.796,57.305],[-0.797,57.305],[-0.804,57.305],[-0.811,57.305],[-0.812,57.305],[-0.819,57.305],[-0.825942149,57.305867769],[-0.826,57.305],[-0.834,57.306],[-0.842,57.306],[-0.839,57.351],[-0.832,57.351],[-0.831,57.351],[-0.831004914,57.350889435],[-0.823,57.35],[-0.817,57.35],[-0.816,57.35],[-0.809,57.35],[-0.808,57.35],[-0.802,57.35],[-0.801,57.35],[-0.794,57.35],[-0.793,57.35],[-0.787,57.35],[-0.786,57.35],[-0.779,57.35],[-0.771,57.349],[-0.764,57.349],[-0.757,57.349],[-0.756,57.349],[-0.749,57.349],[-0.742,57.349],[-0.741,57.349],[-0.735,57.349],[-0.734,57.349],[-0.727,57.349],[-0.726,57.349],[-0.72,57.349],[-0.719,57.349],[-0.719007353,57.348889706],[-0.711,57.348],[-0.705,57.348],[-0.704,57.348],[-0.697,57.348],[-0.696,57.348],[-0.69,57.348],[-0.689,57.348],[-0.682,57.348],[-0.681,57.348],[-0.675,57.348],[-0.674,57.348],[-0.667,57.348],[-0.666,57.348],[-0.666008264,57.347876033],[-0.659,57.347],[-0.652,57.347],[-0.645,57.347],[-0.644,57.347],[-0.637,57.347],[-0.63,57.347],[-0.629,57.347],[-0.622,57.347],[-0.614,57.347],[-0.617,57.302],[-0.625,57.302],[-0.632,57.302],[-0.633,57.302],[-0.639,57.302],[-0.64,57.302],[-0.647,57.302]]],[[[-3.178,57.581],[-3.179,57.626],[-3.171,57.626],[-3.17,57.626],[-3.163,57.626],[-3.156,57.626],[-3.155,57.626],[-3.148,57.626],[-3.141,57.626],[-3.14,57.626],[-3.133,57.626],[-3.132,57.626],[-3.126,57.626],[-3.125,57.626],[-3.118,57.626],[-3.117,57.626],[-3.111,57.626],[-3.11,57.626],[-3.103,57.626],[-3.102,57.626],[-3.096,57.626],[-3.095,57.626],[-3.088,57.626],[-3.087,57.626],[-3.081,57.626],[-3.08,57.626],[-3.073,57.626],[-3.072,57.626],[-3.065,57.626],[-3.058,57.626],[-3.057,57.626],[-3.05,57.626],[-3.043,57.626],[-3.042,57.626],[-3.035,57.626],[-3.028,57.626],[-3.027,57.626],[-3.02,57.626],[-3.019,57.626],[-3.013,57.626],[-3.012,57.626],[-3.005,57.626],[-3.004,57.626],[-2.998,57.626],[-2.997,57.626],[-2.99,57.626],[-2.989,57.626],[-2.983,57.626],[-2.982,57.626],[-2.975,57.626],[-2.974,57.626],[-2.968,57.626],[-2.967,57.626],[-2.959,57.626],[-2.959,57.581],[-2.967,57.581],[-2.968,57.581],[-2.974,57.581],[-2.975,57.581],[-2.982,57.581],[-2.983,57.581],[-2.989,57.581],[-2.99,57.581],[-2.997,57.581],[-2.998,57.581],[-3.004,57.581],[-3.005,57.581],[-3.012,57.581],[-3.013,57.581],[-3.019,57.581],[-3.02,57.581],[-3.027,57.581],[-3.028,57.581],[-3.034,57.581],[-3.035,57.581],[-3.042,57.581],[-3.043,57.581],[-3.05,57.581],[-3.057,57.581],[-3.058,57.581],[-3.065,57.581],[-3.072,57.581],[-3.073,57.581],[-3.08,57.581],[-3.087,57.581],[-3.088,57.581],[-3.095,57.581],[-3.096,57.581],[-3.102,57.581],[-3.103,57.581],[-3.11,57.581],[-3.111,57.581],[-3.117,57.581],[-3.118,57.581],[-3.125,57.581],[-3.126,57.581],[-3.132,57.581],[-3.133,57.581],[-3.14,57.581],[-3.141,57.581],[-3.147,57.581],[-3.148,57.581],[-3.155,57.581],[-3.156,57.581],[-3.162,57.581],[-3.163,57.581],[-3.17,57.581],[-3.171,57.581],[-3.178,57.581]]],[[[-0.139,57.776],[-0.14,57.776],[-0.139989011,57.776123626],[-0.147,57.777],[-0.154,57.777],[-0.155,57.777],[-0.161,57.777],[-0.162,57.777],[-0.169,57.777],[-0.17,57.777],[-0.177,57.777],[-0.184,57.777],[-0.185,57.777],[-0.18499022,57.777110024],[-0.193,57.778],[-0.199,57.778],[-0.2,57.778],[-0.207,57.778],[-0.208,57.778],[-0.214,57.778],[-0.215,57.778],[-0.222,57.778],[-0.223,57.778],[-0.229,57.778],[-0.23,57.778],[-0.229992647,57.778110294],[-0.238,57.779],[-0.245,57.779],[-0.252,57.779],[-0.253,57.779],[-0.26,57.779],[-0.261,57.779],[-0.267,57.779],[-0.268,57.779],[-0.275,57.779],[-0.276,57.779],[-0.275989011,57.779123626],[-0.283,57.78],[-0.29,57.78],[-0.291,57.78],[-0.298,57.78],[-0.305,57.78],[-0.306,57.78],[-0.313,57.78],[-0.32,57.78],[-0.321,57.78],[-0.320992647,57.780110294],[-0.329,57.781],[-0.335,57.781],[-0.336,57.781],[-0.343,57.781],[-0.344,57.781],[-0.35,57.781],[-0.351,57.781],[-0.358,57.781],[-0.359,57.781],[-0.366,57.781],[-0.372942149,57.781867769],[-0.373,57.781],[-0.381,57.782],[-0.388,57.782],[-0.389,57.782],[-0.396,57.782],[-0.397,57.782],[-0.403,57.782],[-0.404,57.782],[-0.411,57.782],[-0.412,57.782],[-0.418,57.782],[-0.419,57.782],[-0.418992647,57.782110294],[-0.427,57.783],[-0.434,57.783],[-0.442,57.783],[-0.439,57.828],[-0.431,57.828],[-0.43,57.828],[-0.430010989,57.827876374],[-0.423,57.827],[-0.416,57.827],[-0.415,57.827],[-0.409,57.827],[-0.408,57.827],[-0.401,57.827],[-0.4,57.827],[-0.393,57.827],[-0.386,57.827],[-0.385,57.827],[-0.378,57.827],[-0.377,57.827],[-0.377010989,57.826876374],[-0.37,57.826],[-0.363,57.826],[-0.362,57.826],[-0.356,57.826],[-0.355,57.826],[-0.348,57.826],[-0.347,57.826],[-0.34,57.826],[-0.333,57.826],[-0.332,57.826],[-0.332007353,57.825889706],[-0.324,57.825],[-0.318,57.825],[-0.317,57.825],[-0.31,57.825],[-0.309,57.825],[-0.303,57.825],[-0.302,57.825],[-0.295,57.825],[-0.294,57.825],[-0.287,57.825],[-0.279,57.824],[-0.272,57.824],[-0.271,57.824],[-0.265,57.824],[-0.264,57.824],[-0.257,57.824],[-0.256,57.824],[-0.25,57.824],[-0.249,57.824],[-0.242,57.824],[-0.241,57.824],[-0.241010989,57.823876374],[-0.234,57.823],[-0.227,57.823],[-0.226,57.823],[-0.219,57.823],[-0.218,57.823],[-0.212,57.823],[-0.211,57.823],[-0.204,57.823],[-0.203,57.823],[-0.197,57.823],[-0.196,57.823],[-0.196007353,57.822889706],[-0.188,57.822],[-0.181,57.822],[-0.174,57.822],[-0.173,57.822],[-0.166,57.822],[-0.159,57.822],[-0.158,57.822],[-0.151,57.822],[-0.15,57.822],[-0.150010989,57.821876374],[-0.143,57.821],[-0.136,57.821],[-0.135,57.821],[-0.129,57.821],[-0.128,57.821],[-0.121,57.821],[-0.12,57.821],[-0.113,57.821],[-0.106,57.821],[-0.105,57.821],[-0.10500978,57.820889976],[-0.097,57.82],[-0.101,57.776],[-0.109,57.776],[-0.116,57.776],[-0.117,57.776],[-0.124,57.776],[-0.125,57.776],[-0.131,57.776],[-0.132,57.776],[-0.139,57.776]]]]
    },
    "properties": {
      "name": "help"
    }
  };
*/

var workplease = new L.GeoJSON(object, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup('<h1>'+feature.properties.id+'</h1><p>name: '+feature.properties.name+'</p>');
    }
  }).addTo(map);


var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);