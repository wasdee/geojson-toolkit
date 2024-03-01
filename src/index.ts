#!/usr/bin/env node

import figlet from "figlet";
import { Command } from "commander";
import { actionRunner, validateInt } from "./utils";
import { action } from "./action";

const PACKAGE_VERSION = require("../package.json").version;

console.log(figlet.textSync("GeoJSON Toolkit"));

const program = new Command();

program
  .version(PACKAGE_VERSION || "unknown version")
  .description(
    "An interactive cli/library toolkit to interact with geojson via cli, primary for optimization, mapbox-prefer format"
  )
  .argument("<geojson>", "GeoJSON input file.")
  .option(
    "-p, --precision <precision>",
    "Set the precision of coordinates. Default is 6.",
    validateInt
  )
  .option(
    "-e, --extraPrecision <precision>",
    "Set the extra precision for things like the z value when the coordinate is [longitude, latitude, elevation]. Default is 2.",
    validateInt
  )
  .option(
    "-P, --propertySplit",
    "Split properties to properties file and remove properties from geojson."
  )
  .option(
    "-i, --noIndex",
    "remove `index` to properties and geom file for flutter mapbox SDK.  Default is false."
  )
  .showHelpAfterError();

program.action(actionRunner(action));

program.parse();
