const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Здравствуйте! Пожалуйста, введите текст для записи в файл\n')

process.on('exit', () => stdout.write('Спасибо! Ввод текста завершен'));
process.on('SIGINT', () => process.exit());

stdin.on('data', data => {
  const dataStringified = data.toString();

  if (dataStringified.trim() === 'exit') {
    process.exit();
  } else {
    output.write(dataStringified);
  }
});