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
import { functionsPath, advancementsPath } from "./generate.js";

export default function generateCore() {
    // create index.mcfunction
    let content = `
scoreboard objectives add sys dummy
scoreboard objectives add items dummy
advancement revoke @a everything
scoreboard players set border sys 0
function simondmc:sync_border

# setup
weather clear

# for chest.js
scoreboard players set last_page_item sys 0
`;

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
        content = `execute as @s[tag=lobby] run advancement revoke @s only simondmc:${
            item[1]
        }
execute as @s[tag=!lobby] unless score ${
            item[1]
        } items matches 1.. run tellraw @a [{"selector":"@s","color":"green"},{"text":" obtained ${
            getPreposition(item[0]) + item[0]
        }!","color":"green"}]
execute as @s[tag=!lobby] unless score ${
            item[1]
        } items matches 1.. run function simondmc:obtain
execute as @s[tag=!lobby] unless score ${
            item[1]
        } items matches 1.. run scoreboard players set ${item[1]} items 1`;

        fs.writeFileSync(itemFunctionsPath + `/${item[1]}.mcfunction`, content);
    });

    // create obtain function
    content = `scoreboard players add border sys 1
execute if score border sys matches 10 run tellraw @a ["",{"text":"You have unlocked the lobby! Enter it with ","color":"gold"},{"text":"/trigger lobby","color":"yellow","clickEvent":{"action":"suggest_command","value":"/trigger lobby"}},{"text":"!","color":"gold"}]
execute if score border sys matches 10 run playsound minecraft:entity.player.levelup master @s
execute as @a at @s run playsound minecraft:entity.experience_orb.pickup master @s
function simondmc:sync_border`;

    fs.writeFileSync(functionsPath + "/obtain.mcfunction", content);

    // create sync_border function
    content = "";

    for (let i = 0; i <= items.length; i++) {
        content += `execute if score border sys matches ${i} run worldborder set ${
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
}
