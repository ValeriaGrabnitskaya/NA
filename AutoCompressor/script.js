const readline = require('readline');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const Copy = 'COPY';
const Create = 'CREATE';

rl.question('Введите путь к папке: ', folderPath => {
    if (!folderPath)
        rl.close();
    else {
        let isFinished = readFiles(folderPath);
        if(isFinished) {
            rl.close();
        }
    }
});

function readFiles(folderPath) {
    console.log('Сканируется папка:', path.parse(folderPath).name);
    let files = fs.readdirSync(folderPath);

    files.forEach((fileName) => {
        let filePath = path.join(folderPath, fileName);
        let gzipFilePath = path.join(folderPath, fileName + '.gz');
        
        if (fs.lstatSync(filePath).isDirectory()) {
            readFiles(filePath);
        } else {
            if (!/\.gz/i.test(fileName)) {
                if (!files.includes(fileName + '.gz')) {
                    gzipFile(filePath, fileName, gzipFilePath, Create);
                } else {
                    let fileCreationTime = fs.statSync(filePath);
                    let gzipFileCreationTime = fs.statSync(gzipFilePath);

                    if (fileCreationTime.mtimeMs > gzipFileCreationTime.mtimeMs) {
                        fs.unlinkSync(gzipFilePath);
                        gzipFile(filePath, fileName, gzipFilePath, Copy);
                    } else {
                        console.log('Архив', fileName + '.gz', 'актуален');
                        console.log('----------------------------------');
                    }
                }
            }
        }
    })
    return true;
}

function gzipFile(filePath, fileName, gzipFilePath, action) {
    var readFile = fs.readFileSync(filePath);
    console.log('Архив', fileName + '.gz', action === Create ? 'начал создаваться' : 'начал пересоздаваться')
    var gzipFile = zlib.gzipSync(readFile);
    fs.writeFileSync(gzipFilePath, gzipFile);
    console.log('Архив', fileName + '.gz', action === Create ? 'готов' : 'пересоздан');
    console.log('----------------------------------');
}
