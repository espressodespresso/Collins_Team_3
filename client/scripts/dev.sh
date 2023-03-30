#!/usr/bin/env bash
echo "Attempting to build..."

{
  uglifyjs ../src/js/index.js -mc > ../src/js/index.min.js && echo "Minifying using uglifyjs..." &&
  echo "Success..."
} || {
  echo "Build failed... ($__EXCEPTION_SOURCE__)"
  sleep 10s
}