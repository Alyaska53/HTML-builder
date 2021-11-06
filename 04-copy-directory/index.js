const fs = require('fs');
const path = require('path');

async function copyDir() {
  const originalDirPath = path.join(__dirname, 'files');
  const copyDirPath = path.join(__dirname, 'files-copy');

  await fs.promises.mkdir(copyDirPath, { recursive: true });

  const oldFiles = await fs.promises.readdir(copyDirPath);

  if (oldFiles.length) {
    for (let file of oldFiles) {
      await fs.promises.unlink(path.join(copyDirPath, file));
    }
  }

  const originalFiles = await fs.promises.readdir(originalDirPath);
  try {
    for (let file of originalFiles) {
      const originalFilePath = path.join(originalDirPath, file);
      const copyFilePath = path.join(copyDirPath, file);
      
      await fs.promises.copyFile(originalFilePath, copyFilePath);
    }
  } catch {
    console.error(error);
  }

  console.log('Сopying completed');
}

copyDir();