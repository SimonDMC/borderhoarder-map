/*
    This script wipes the entire data folder

    Refer to README for info about why this is written in JS
*/

import fs from "fs";

const basePath = process.cwd() + "/data";

// wipe the data folder
if (fs.existsSync(basePath)) {
    fs.rmSync(basePath, { recursive: true, force: true });
}
