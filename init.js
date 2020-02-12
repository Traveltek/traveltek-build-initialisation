"use strict";

const fs = require("fs");
const path = require("path");

class FileSpec {
  constructor(targetDir, product, versionno) {
    this.targetDir = targetDir;
    this.product = product;
    this.versionno = versionno;
    this.baseDir = path.resolve(
      __dirname,
      "products",
      this.product,
      this.versionno
    );

    this.loadSpec();
  }

  loadSpec() {
    let specFile = fs.readFileSync(path.resolve(this.baseDir, "filespec.json"));
    let spec = JSON.parse(specFile);
    this.spec = spec;
    return this;
  }

  build() {
    this.buildDirStructure().copyFiles();
    return this;
  }

  buildDirStructure() {
    for (let directory of this.spec.directories) {
      let dirPath = path.resolve(this.targetDir, fixFilePath(directory));
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
    }
    return this;
  }

  copyFiles() {
    let fileList = [];
    fileList = fileList.concat(
      this.spec.other,
      this.spec.yamlconfig,
      this.spec.scssvariables,
      this.spec.localefiles
    );
    for (let file of fileList) {
      if (fs.existsSync(path.resolve(this.baseDir, 'template', fixFilePath(file)))) {
        fs.copyFileSync(
          path.resolve(this.baseDir, 'template', fixFilePath(file)),
          path.resolve(this.targetDir, fixFilePath(file))
        );
      }
    }
    return this;
  }
}

function fixFilePath(filePath) {
  return path.join(...filePath.split("/"));
}

module.exports = (targetDir, product, versionNo) => {
  let spec = new FileSpec(targetDir, product, versionNo).build();
  return spec;
};
