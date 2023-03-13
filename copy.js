import fs from "fs";
import { basePath, advancementsPath, functionsPath } from "./generate.js";

export default function copyStatic() {
    const staticPath = process.cwd() + "/static";

    const functionTagPath = basePath + "/minecraft/tags/functions";

    // make sure the function tag folder exists
    if (!fs.existsSync(functionTagPath)) {
        fs.mkdirSync(functionTagPath, { recursive: true });
    }

    // copy tick.json
    fs.copyFileSync(staticPath + "/tick.json", functionTagPath + "/tick.json");

    // copy advancements
    fs.copyFileSync(
        staticPath + "/click_stand.json",
        advancementsPath + "/click_stand.json"
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
}
