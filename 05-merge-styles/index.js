const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

async function createBundle(from, where) {
  const files = await fsp.readdir(from, { withFileTypes: true });
  for (let file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readSteam = fs.createReadStream(
        path.join(from, file.name),
        'utf-8',
      );
      readSteam.pipe(where);
    }
  }
}
void createBundle(
  path.join(__dirname, 'styles'),
  fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
    'utf-8',
  ),
);
