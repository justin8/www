#!/bin/bash

if [[ $PWD != "/asset-input" ]]; then
  echo "This command should only be run inside of a CDK bundling command. Aborting"
  exit 1
fi

cp -vr index.html css img vendor /asset-output/
