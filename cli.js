#!/usr/bin/env node

"use strict";

const path = require("path");
const inquirer = require("inquirer");
const loadinit = require("./init");

const products = {
  basket: ["1.0.0", "0.1.0"],
  tours: ["0.1.1", "0.2.1"]
};

require("yargs")
  .strict()
  .command(
    ["init [product]", "$0 [product]"],
    "Initialise a new build repository",
    yargs => {
      yargs
        .strict()
        .positional("product", {
          describe: "The product to initialise.",
          choices: Object.keys(products)
        })
        .positional("versionnumber", {
          describe: "The version of the product to initialise.",
          string: true
        });
    },
    init
  )
  .option("cwd", {
    type: "string",
    default: process.cwd(),
    describe: "Working directory to install into.",
    normalize: true,
    coerce: cwd => {
      return path.resolve(cwd);
    }
  })
  .demandCommand(1).argv;

function init(params) {
  if (params.cwd) {
    process.chdir(params.cwd);
  }

  if (!params.product) {
    inquirer
      .prompt({
        type: "list",
        name: "product",
        choices: Object.keys(products)
      })
      .then(panswers => {
        console.log(panswers);
        inquirer
          .prompt({
            type: "list",
            name: "versionno",
            choices: products[panswers.product]
          })
          .then(vanswers => {
            loadinit(params.cwd, panswers.product, vanswers.versionno);
          });
      });
  } else {
    inquirer
      .prompt({
        type: "list",
        name: "versionno",
        choices: products[params.product]
      })
      .then(vanswers => {
        loadinit(params.cwd, params.product, vanswers.versionno);
      });
  }
}
