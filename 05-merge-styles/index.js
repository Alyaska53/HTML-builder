const fs = require('fs');
const path = require('path');

async function writeStyles() {
  try {
    const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    let cssStyles = [];

    for (let file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'styles', file.name);
        const extension = path.extname(filePath);

        if (extension === '.css') {
          const stream = fs.createReadStream(filePath, 'utf-8');
          let data = '';

          for await (const chunk of stream) {
            data += chunk;
          }

          cssStyles.push(data);
        };
      }
    }

    const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');
  
    for (let style of cssStyles) {
      output.write(`${style}\n`);
    }
  } catch (error) {
    console.log(error);
  }
}

writeStyles();