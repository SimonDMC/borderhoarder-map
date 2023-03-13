/*
    This script generates the following files/functions:
    - index.mcfunction
    - obtain.mcfunction
    - sync_border.mcfunction
    - items/*.mcfunction
    - advancements/*.json

    Refer to README for info about why this is written in JS
*/

import fs from "fs";
import { items } from "./items.js";

const basePath = process.cwd() + "/data";

// make sure the data folder exists
if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
}

const functionsPath = basePath + "/simondmc/functions";
const advancementsPath = basePath + "/simondmc/advancements";

// make sure folders exist
if (!fs.existsSync(functionsPath)) {
    fs.mkdirSync(functionsPath, { recursive: true });
}
if (!fs.existsSync(advancementsPath)) {
    fs.mkdirSync(advancementsPath, { recursive: true });
}

// create index.mcfunction
let content = `
scoreboard objectives add border dummy
scoreboard players set global border 0
function simondmc:sync_border
`;

items.forEach((item) => {
    content += `scoreboard objectives add ${item[1]} dummy
scoreboard players set global ${item[1]} 0
advancement revoke @a only simondmc:${item[1]}
`;
});

fs.writeFileSync(functionsPath + "/index.mcfunction", content);

// create advancements
items.forEach((item) => {
    content = `{
    "criteria": {
        "requirement": {
            "trigger": "minecraft:inventory_changed",
            "conditions": {
                "items": [
                    {
                        "items": [
                            "minecraft:${item[1]}"
                        ]
                    }
                ]
            }
        }
    },
    "rewards": {
        "function": "simondmc:items/${item[1]}"
    }
}`;
    fs.writeFileSync(advancementsPath + `/${item[1]}.json`, content);
});

// create item functions
const itemFunctionsPath = functionsPath + "/items";
if (!fs.existsSync(itemFunctionsPath)) {
    fs.mkdirSync(itemFunctionsPath, { recursive: true });
}

items.forEach((item) => {
    content = `execute if score global ${
        item[1]
    } matches 0 run tellraw @a [{"selector":"@a[advancements={simondmc:${
        item[1]
    }=true}]","color":"green"},{"text":" obtained ${
        getPreposition(item[0]) + item[0]
    }!","color":"green"}]
execute if score global ${item[1]} matches 0 run function simondmc:obtain
execute if score global ${
        item[1]
    } matches 0 run scoreboard players set global ${item[1]} 1`;

    fs.writeFileSync(itemFunctionsPath + `/${item[1]}.mcfunction`, content);
});

// create obtain function
content = `scoreboard players add global border 1
execute as @a at @s run playsound minecraft:entity.experience_orb.pickup master @s
function simondmc:sync_border`;

fs.writeFileSync(functionsPath + "/obtain.mcfunction", content);

// create sync_border function
content = "";

for (let i = 0; i <= items.length; i++) {
    content += `execute if score global border matches ${i} run worldborder set ${
        i * 2 + 1
    } 1
`;
}

fs.writeFileSync(functionsPath + "/sync_border.mcfunction", content);

function getPreposition(item) {
    // plural = s
    if (item.endsWith("s")) {
        return "";
    }
    // starts with a vowel = an
    if (["a", "e", "i", "o", "u"].includes(item[0].toLowerCase())) {
        return "an ";
    }
    // otherwise = a
    return "a ";
}
