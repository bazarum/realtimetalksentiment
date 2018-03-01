#!/bin/bash
tmpdir="/tmp/"
while true
do
 ts=`date +"%s"`
 n_image="$1.image.${ts}.jpeg"
 n_screen="$1.screen.${ts}.jpeg"
 echo "Creating the images Smile!!! "
 imagesnap -w 3 $tmpdir/$n_image
 echo "Done"
 screencapture -x $tmpdir/$n_screen
 echo "Sending to Google Cloud Storage ..."
 gsutil cp $tmpdir/$n_image gs://talksentiment
 gsutil cp $tmpdir/$n_screen gs://talksentimentscreens
 echo "Waiting for the next Status ..."
 sleep 2
done

