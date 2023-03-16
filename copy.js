/*
    This script copies the following files/functions to the data folder:
    - tick.json
    - empty_pane.json
    - tick.mcfunction
    - lobby.mcfunction
    - click_stand.mcfunction
    - in_lobby.json

    All of these files are in the static/ folder due to the data folder
    being wiped every time the script is run.

    Refer to README for info about why this is written in JS
*/

import fs from "fs";
import {
    basePath,
    functionsPath,
    lootTablesPath,
    predicatesPath,
} from "./generate.js";

export default function copyStatic() {
    const staticPath = process.cwd() + "/static";

    const functionTagPath = basePath + "/minecraft/tags/functions";

    // make sure the function tag folder exists
    if (!fs.existsSync(functionTagPath)) {
        fs.mkdirSync(functionTagPath, { recursive: true });
    }

    // copy tick.json
    fs.copyFileSync(staticPath + "/tick.json", functionTagPath + "/tick.json");

    // copy loot tables
    fs.copyFileSync(
        staticPath + "/empty_pane.json",
        lootTablesPath + "/empty_pane.json"
    );

    // copy functions
    fs.copyFileSync(
        staticPath + "/tick.mcfunction",
        functionsPath + "/tick.mcfunction"
    );
    fs.copyFileSync(
        staticPath + "/lobby.mcfunction",
        functionsPath + "/lobby.mcfunction"
    );
    fs.copyFileSync(
        staticPath + "/click_stand.mcfunction",
        functionsPath + "/click_stand.mcfunction"
    );

    // copy predicates
    fs.copyFileSync(
        staticPath + "/in_lobby.json",
        predicatesPath + "/in_lobby.json"
    );
}
