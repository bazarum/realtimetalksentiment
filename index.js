const vision = require('@google-cloud/vision')();
const storage = require('@google-cloud/storage')();
const BigQuery = require('@google-cloud/bigquery');


exports.newSentimentStatus = function (event, callback) {
  const file = event.data;

  if (file.resourceState === 'not_exists') {
    console.log(`File ${file.name} deleted.`);
  } else if (file.metageneration === '1') {
    // metageneration attribute is updated on metadata changes.
    // on create value is 1
    console.log(`Bucket: ${file.name}`);
    console.log(`File  : ${file.name} uploaded.`);
    console.log(`Sending to ML Vision API`);

  } else {
    console.log(`File ${file.name} metadata updated.`);
  }

  filecloud = storage.bucket(file.bucket).file(file.name);
  vision.detectFaces(filecloud, function (err, faces) {
    if (err) {
      console.error(`Failed to analyze ${file.name}.`, err);
    }
    var numFaces = faces.length;
    var topic = file.name.split(".")[0];
    var ts = +file.name.split(".")[2];
    var tjoy = 0;
    var tanger = 0;
    var tsorrow = 0;
    var tsurprise = 0;
    console.log('Found ' + numFaces + (numFaces === 1 ? ' face' : ' faces'));

    if (numFaces >= 1) {
      faces.forEach(function (face, i) {
        console.log(`Face #${i + 1}:`);
        console.log(`  Joy: ${face.joy}`);
        console.log(`  Anger: ${face.anger}`);
        console.log(`  Sorrow: ${face.sorrow}`);
        console.log(`  Surprise: ${face.surprise}`);
        if (face.joy) {
          tjoy += 1;
          }
        if (face.anger) {
          tanger += 1;
          }
        if (face.sorrow) {
          tsorrow += 1;
          }
        if (face.surprise) {
          tsurprise += 1;
          }
      });

      const bigquery = BigQuery({
        projectId: "bdoctors-169610"
      })

      var Dataset = bigquery.dataset('talksentiment');
      var Table = Dataset.table('samples');

      console.log(`Recording DATA`);
      rows = [{'when': ts, 'topic': topic, 'faces': faces.length, 'joy': tjoy, 'anger':tanger, 'sorrow':tsorrow, 'surprise':tsurprise}];
      console.log('data:' + JSON.stringify(rows));
      bigquery
        .dataset("talksentiment")
        .table("samples")
        .insert(rows)
        .then((data) => {
          console.log('Inserted:' + JSON.stringify(data));
          rows.forEach((row) => console.log(row));
          /*
          if (insertErrors && insertErrors.length > 0) {
            console.log('---> Insert errors:');
            insertErrors.forEach((err) => console.error(err));
          }
          */
        })
        .catch((err) => {
          console.error('ERROR:', err);
        });
    }
  });
  callback();
};
