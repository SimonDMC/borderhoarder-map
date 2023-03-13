/*
    This script calls all the following scripts (in order):
    - wipe.js
    - core.js
    - chest.js

    It also defines path variables for the other scripts to use.

    Refer to README for info about why this is written in JS
*/

import fs from "fs";
import { startTimer, endTimer } from "./time.js";
import wipe from "./wipe.js";
import generateCore from "./core.js";
import generateChest from "./chest.js";

// wipe previous data
startTimer("wipe");
wipe();
endTimer("wipe");

// define path variables
export const basePath = process.cwd() + "/data";

// make sure the data folder exists
if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
}

export const functionsPath = basePath + "/simondmc/functions";
export const advancementsPath = basePath + "/simondmc/advancements";
export const lootTablesPath = basePath + "/simondmc/loot_tables";

// make sure folders exist
if (!fs.existsSync(functionsPath)) {
    fs.mkdirSync(functionsPath, { recursive: true });
}
if (!fs.existsSync(advancementsPath)) {
    fs.mkdirSync(advancementsPath, { recursive: true });
}
if (!fs.existsSync(lootTablesPath)) {
    fs.mkdirSync(lootTablesPath, { recursive: true });
}

// call generation scripts
startTimer("generateCore");
generateCore();
endTimer("generateCore");

startTimer("generateChest");
generateChest();
endTimer("generateChest");

console.log("\x1b[32mDone generating files!\x1b[0m");
