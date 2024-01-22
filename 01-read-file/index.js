const fs = require('fs');
const path = require('path');
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'));
stream.on('data', (data) => console.log(data.toString()));
