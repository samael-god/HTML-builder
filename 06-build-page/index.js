const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
});

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
createBundle(
  path.join(__dirname, 'styles'),
  fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
    'utf-8',
  ),
).catch((err) => {
  console.error(err);
});

function copyDir() {
  async function deleteDir() {
    await fsp.rm(path.join(__dirname, 'project-dist', 'assets'), {
      recursive: true,
      force: true,
    });
  }

  async function deepCopy(sourceFolder, copyFolder) {
    const files = await fsp.readdir(sourceFolder, { withFileTypes: true });

    await fsp.mkdir(copyFolder, { recursive: true });
    for (let file of files) {
      const sourcePath = path.join(sourceFolder, file.name);
      const copyPath = path.join(copyFolder, file.name);
      if (file.isDirectory()) {
        await deepCopy(sourcePath, copyPath);
      } else {
        await fsp.copyFile(sourcePath, copyPath);
      }
    }
  }
  deleteDir().then(() => {
    deepCopy(
      path.join(__dirname, 'assets'),
      path.join(__dirname, 'project-dist', 'assets'),
    ).catch((err) => {
      console.error(err);
    });
  });
}

copyDir();

async function createHtml() {
  let componentContent;
  async function createIndex(from, where) {
    const templateFile = await fs.createReadStream(from, 'utf-8');
    const index = fs.createWriteStream(where);
    templateFile.pipe(index);
  }

  async function readComponent(component) {
    await fsp
      .readFile(path.join(__dirname, 'components', component.name))
      .then(function (result) {
        return (componentContent = result.toString());
      });
  }

  async function addComponentToIndex() {
    const components = await fsp.readdir(path.join(__dirname, 'components'), {
      withFileTypes: true,
    });
    let index = await fsp.readFile(
      path.join(__dirname, 'project-dist', 'index.html'),
      'utf-8',
    );
    for (const component of components) {
      await readComponent(component);
      let tagName = `{{${component.name.split('.').slice(0, 1).join('')}}}`;
      let regExp = new RegExp(tagName);
      index = index.replace(regExp, componentContent);
      const result = fs.createWriteStream(
        path.join(__dirname, 'project-dist', 'index.html'),
      );
      result.write(index);
    }
  }
  await createIndex(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'project-dist', 'index.html'),
  );
  await addComponentToIndex();
}
createHtml()
  .catch((err) => {
    console.error(err);
  })
  .then(() => console.log('Success!'));
