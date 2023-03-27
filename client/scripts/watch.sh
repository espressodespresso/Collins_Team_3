#!/usr/bin/env bash
echo "Attempting to watch..."

{
  tsc --watch && echo "Watching typescript files..." &&
  watchify ../src/js/index.js -o ../src/js/index.js -v
} || {
  echo "Build failed... ($__EXCEPTION_SOURCE__)"
  sleep 10s
}