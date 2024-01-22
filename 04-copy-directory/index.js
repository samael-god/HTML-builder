const fsp = require('fs').promises;
const path = require('path');

function copyDir() {
  async function deleteDir() {
    await fsp.rm(path.join(__dirname, 'files-copy'), {
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
    return deepCopy(
      path.join(__dirname, 'files'),
      path.join(__dirname, 'files-copy'),
    );
  });
}

copyDir();
