#!/bin/bash
grunt build-minified
cp -Rf dist/ ../crimper-heroku/dist/
pushd
cd ../crimper-heroku/
git add --all .
git commit -am 'auto-update heroku distro'
git push
popd
