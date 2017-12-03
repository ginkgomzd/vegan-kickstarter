#!/bin/bash
# http://lelandbatey.com/posts/2015/02/ember-and-cordova/ 

if [[ $CORDOVA_CMDLINE =~ release ]]; then
	echo "Creating production build of ember app"
	(cd vegan* && ember build --environment=production)
else
	echo "Creating debug build of ember app"
	(cd vegan* && ember build --environment=development)
fi
