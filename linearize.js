var ps = require('geo-pixel-stream'),
    readers = ps.createReadStreams('6830_2470.tif'),
    fs = require('fs');

console.log(readers);
console.log(readers.length);
console.log(readers[0].metadata);

var numPoints = 0;
var blocks = [];

readers[0].on('data', function(data) {
    var blockPoints = [],
        blockLen = data.blockSize.x * data.blockSize.y;

    for(var i=0;i<blockLen;i++) blockPoints.push(data.buffer[i]);
    blocks.push(blockPoints);
});



readers[0].on('end', function() {
  fs.writeFile('data.json', JSON.stringify(blocks), function() {
    console.log("Written " + blocks.length + " blocks to file.");
  });
});
