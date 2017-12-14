#!/bin/bash

if [[ $CORDOVA_PLATFORMS =~ android ]]; then
  echo 'deploy release-signing.properties'
  cp release-signing.properties ./platforms/android/
fi
