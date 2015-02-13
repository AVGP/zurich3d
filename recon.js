var ps = require('geo-pixel-stream'),
    readers = ps.createReadStreams('6830_2470.tif');

console.log(readers);
console.log(readers.length);
console.log(readers[0].metadata);

readers[0].on('data', function(data) {
  console.log("----", data.offset, data.blockSize, data.buffer[0]);
});

readers[0].on('end', function() {
  console.log("Done.");
});
