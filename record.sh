#!/bin/bash
tmpdir="/tmp/"
while true
do
 ts=`date +"%s"`
 n_image="$1.image.${ts}.jpeg"
 n_screen="$1.screen.${ts}.jpeg"
 echo "Creating the images ..."
 imagesnap -w 1 $tmpdir/$n_image
 screencapture -x $tmpdir/$n_screen
 echo "Sending to Google Cloud Storage ..."
 gsutil cp $tmpdir/$n_image gs://talksentiment
 echo "Waiting for the next Status ..."
 sleep 5
done

