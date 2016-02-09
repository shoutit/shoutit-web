#!/bin/sh
# from https://github.com/sandcastle/circleci-docker/blob/master/script/ci-test

set -e

cd "$(dirname "$0")/.."
echo "Running tests"
date "+%H:%M:%S"
MOCHA_FILE=$CIRCLE_TEST_REPORTS/test-results.xml npm test:cover
