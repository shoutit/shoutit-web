#! /bin/bash -e
#/ Usage: upload-static.sh LOCAL_PATH S3_BUCKET_NAME PATH
#/ This script
#/   - Uploads built static files to S3

if [ -z "$1" ]; then
    echo "Please provide local path"
    exit 1
fi

if [ -z "$2" ]; then
    echo "Please provide name for S3 bucket"
    exit 1
fi

if [ -z "$3" ]; then
    echo "Please provide path under $1"
    exit 1
fi

# Built Public
aws s3 cp --recursive "$1" "s3://$2/$3/"
