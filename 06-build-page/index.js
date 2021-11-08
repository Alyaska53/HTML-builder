const fs = require('fs');
const path = require('path');

async function getDataFromFile(filePath) {
  const stream = fs.createReadStream(filePath, 'utf-8');
  let data = '';
  
  for await (const chunk of stream) {
    data += chunk;
  }

  return data;
}

async function getHTMLComponents() {
  let components = {};
  const filesHTML = await fs.promises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});

  for (let file of filesHTML) {
    if (file.isFile()) {
      const filePath = path.join(__dirname, 'components', file.name);
      const extension = path.extname(filePath);

      if (extension === '.html') {
        const tagName = path.basename(filePath, extension);
        const data = await getDataFromFile(filePath);

        components[tagName] = data;
      }
    }
  }

  return components;
}

async function getCssStyles() {
  const cssFiles = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
  let cssStyles = [];

  for(let file of cssFiles) {
    if (file.isFile()) {
      const filepath = path.join(__dirname, 'styles', file.name);

      if (path.extname(filepath) === '.css') {
        const data = await getDataFromFile(filepath);
        cssStyles.push(data);
      }
    }
  }

  return cssStyles;    
}

async function copyDir(originalDirPath, copyDirPath) {
  await fs.promises.mkdir(copyDirPath, { recursive: true });

  const originalFiles = await fs.promises.readdir(originalDirPath, { withFileTypes: true });

  for (let file of originalFiles) {
    const originalFilePath = path.join(originalDirPath, file.name);
    const copyFilePath = path.join(copyDirPath, file.name);
    
    if (file.isFile()) {
      try {
        await fs.promises.copyFile(originalFilePath, copyFilePath);
      } catch {
        console.error();
      }
    } else {
      copyDir(originalFilePath, copyFilePath);
    }
  }
}

async function createHTMLpage() {
  try {
    let pageTemplate = await getDataFromFile(path.join(__dirname, 'template.html'));
    const components = await getHTMLComponents();
    const styles = await getCssStyles();

    for (let tag in components) {
      pageTemplate = pageTemplate.replaceAll(`{{${tag}}}`, components[tag]);
    }

    await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    const oldFiles = await fs.promises.readdir(path.join(__dirname, 'project-dist'));

    if (oldFiles.length) {
      for (let file of oldFiles) {
        await fs.promises.rm(path.join(__dirname, 'project-dist', file), {recursive: true});
      }
    }

    await copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));

    const outputHTML = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
    outputHTML.write(`${pageTemplate}`);

    const outputCSS = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');
    for (let style of styles) {
      outputCSS.write(`${style}\n`);
    }
  } catch (error) {
    console.error(error);
  }
}

createHTMLpage();