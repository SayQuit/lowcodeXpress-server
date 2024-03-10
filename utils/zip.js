const AdmZip = require('adm-zip');

function compressProject(inputPath, outputPath, zipName) {
  const zip = new AdmZip();
  zip.addLocalFolder(inputPath);
  zip.writeZip(`${outputPath}/${zipName}.zip`);
}

module.exports = { compressProject }