const fs = require('fs');
const path = require('path');

async function getFiles() {
  try {
    const files = await fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});
    
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        const extension = path.extname(filePath);
        const stat = await fs.promises.stat(filePath);

        let result = `${path.basename(filePath, extension)} - ${extension.slice(1)} - ${stat.size}b`;

        console.log(result);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

getFiles();