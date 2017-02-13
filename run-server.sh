#!/bin/bash

git submodule update --init
(cd themes/hugo-uno && bundle install)
hugo server
