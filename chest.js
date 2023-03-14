import fs from "fs";
import { items } from "./items.js";
import { lootTablesPath, functionsPath } from "./generate.js";

export default function generateChest() {
    const CHEST_1 = "241 -61 436";
    const CHEST_2 = "240 -61 436";

    // create all item loot tables
    items.forEach((item) => {
        let content = `{
    "pools": [
        {
            "rolls": 1,
            "entries": [
                {
                "type": "minecraft:item",
                "name": "minecraft:${item[1]}"
                }
            ]
        }
    ]
}`;

        fs.writeFileSync(lootTablesPath + `/${item[1]}.json`, content);
    });

    // create fill_item function
    let content = "";
    items.forEach((item, index) => {
        content += `execute if score current_fill_item sys matches ${
            index + 1
        } if score slot sys matches ..27 run loot insert ${CHEST_1} loot simondmc:${
            item[1]
        }
execute if score current_fill_item sys matches ${
            index + 1
        } if score slot sys matches 28.. run loot insert ${CHEST_2} loot simondmc:${
            item[1]
        }
`;
    });

    fs.writeFileSync(functionsPath + "/fill_item.mcfunction", content);

    // create find_next_item function
    content = `scoreboard players set found sys 0
scoreboard players set current_fill_item sys 0
`;

    items.forEach((item, index) => {
        content += `execute if score found sys matches 0 if score last_item_filled sys matches ..${index} unless score ${
            item[1]
        } items matches 1.. run scoreboard players set current_fill_item sys ${
            index + 1
        }
execute if score found sys matches 0 if score last_item_filled sys matches ..${index} unless score ${
            item[1]
        } items matches 1.. run scoreboard players set found sys 1
`;
    });

    fs.writeFileSync(functionsPath + "/find_next_item.mcfunction", content);

    // create wipe_chest function
    content = "";
    for (let i = 0; i < 27; i++) {
        content += `item replace block ${CHEST_1} container.${i} with air
item replace block ${CHEST_2} container.${i} with air
`;
    }

    fs.writeFileSync(functionsPath + "/wipe_chest.mcfunction", content);

    // create fill_chest function
    content = `scoreboard players set slot sys 0
execute unless block ${CHEST_2} minecraft:chest{Items:[{Slot:26b, id:"minecraft:arrow"}]} unless score last_page sys matches 1 run scoreboard players operation last_page_item sys = last_item_filled sys
function simondmc:wipe_chest
scoreboard players operation last_item_filled sys = last_page_item sys
`;

    for (let i = 0; i < 45; i++) {
        content += `scoreboard players add slot sys 1
function simondmc:find_next_item
execute if score found sys matches 1 run function simondmc:fill_item
execute if score found sys matches 1 run scoreboard players operation last_item_filled sys = current_fill_item sys
`;
    }

    content += `function simondmc:complete_chest
execute if score found sys matches 1 run item replace block ${CHEST_2} container.26 with arrow{display:{Name:'{"text":"Next Page","color":"green","italic":false}'}}
execute if score found sys matches 0 run scoreboard players set last_page sys 1
`;

    fs.writeFileSync(functionsPath + "/fill_chest.mcfunction", content);

    // create check_chest function
    content = `scoreboard players set empty sys 0
`;
    for (let i = 0; i < 27; i++) {
        content += `execute unless block ${CHEST_1} minecraft:chest{Items:[{Slot:${i}b}]} run scoreboard players set empty sys 1
execute unless block ${CHEST_2} minecraft:chest{Items:[{Slot:${i}b}]} run scoreboard players set empty sys 1
`;
    }

    content += `execute if score empty sys matches 1 run function simondmc:fill_chest`;

    fs.writeFileSync(functionsPath + "/check_chest.mcfunction", content);

    // create complete_chest function
    content = "";
    for (let i = 0; i < 27; i++) {
        content += `execute unless block ${CHEST_1} minecraft:chest{Items:[{Slot:${i}b}]} run item replace block ${CHEST_1} container.${i} with gray_stained_glass_pane{display:{Name:'{"text":""}'}}
execute unless block ${CHEST_2} minecraft:chest{Items:[{Slot:${i}b}]} run item replace block ${CHEST_2} container.${i} with gray_stained_glass_pane{display:{Name:'{"text":""}'}}
`;
    }

    fs.writeFileSync(functionsPath + "/complete_chest.mcfunction", content);
}
