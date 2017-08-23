#!/usr/bin/env bash

BUILD_TAG=`echo "${CIRCLE_TAG:-$CIRCLE_BRANCH}" | sed -e "s/\//-/g"`
echo ${BUILD_TAG}
echo "export BUILD_TAG=${BUILD_TAG}" >> $BASH_ENV
