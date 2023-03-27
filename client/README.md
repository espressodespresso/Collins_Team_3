# Client
Client-side readme

## Dependencies
Before running, make sure you have the following global npm modules
* browerify
* watchify
* uglify-js
* typescript

## Instructions
* Upon pull, run `npm run watch` to add watchers for typescript & browserify (Note: This will NOT compress // minify js)
* To compile (Dev), run `npm run dev`
* To compile (Build), run `npm run build` (Compiles typescript & browserify, ignores watches)