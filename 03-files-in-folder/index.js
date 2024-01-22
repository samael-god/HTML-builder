const fs = require('fs');
const path = require('path');
const directory = path.join(__dirname, 'secret-folder');
fs.readdir(directory, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    console.log('\nCurrent directory filenames:');
    files.forEach((file) => {
      if (file.isFile()) {
        const fullName = file.name;
        const name = path.parse(`${fullName}`).name;
        const ext = path.parse(`${fullName}`).ext;
        fs.stat(path.join(directory, fullName), (err, stats) => {
          if (err) {
            console.log('File doesnt exist.');
          }
          console.log(`${name} - ${ext.slice(1)} - ${stats.size / 1024}KiB`);
        });
      }
    });
  }
});
