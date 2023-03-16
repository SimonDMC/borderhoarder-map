import fs from "fs";
import { functionsPath } from "./generate.js";
import { items } from "./items.js";

const LOBBY_POS = "241 -60 428";

export default function generateLobby() {
    const lobbyPath = functionsPath + "/lobby";

    // make sure the lobby folder exists
    if (!fs.existsSync(lobbyPath)) {
        fs.mkdirSync(lobbyPath, { recursive: true });
    }

    // create block spinning function
    let content = "";
    for (let i = 1; i <= 4; i++) {
        content += `execute if score block_${i}_spin sys matches 35.. run scoreboard players set block_${i}_spin sys 34
execute if score block_${i}_spin sys matches 19.. as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~40 ~
execute if score block_${i}_spin sys matches 17..18 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~35 ~
execute if score block_${i}_spin sys matches 15..16 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~30 ~
execute if score block_${i}_spin sys matches 13..14 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~25 ~
execute if score block_${i}_spin sys matches 11..12 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~20 ~
execute if score block_${i}_spin sys matches 9..10 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~15 ~
execute if score block_${i}_spin sys matches 5..8 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~10 ~
execute if score block_${i}_spin sys matches 1..4 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~5 ~
execute if score block_${i}_spin sys matches 1.. run scoreboard players remove block_${i}_spin sys 1
`;
    }

    fs.writeFileSync(functionsPath + "/spin_blocks.mcfunction", content);

    // create update progress function
    function oneDecimal(num) {
        return (Math.round(num * 10) / 10).toFixed(1);
    }

    content = "";
    for (let i = 0; i <= items.length; i++) {
        content += `execute if score border sys matches ${i} run data merge entity @s {text:'{"text":"Items Collected: ${i}/${
            items.length
        } (${oneDecimal((i / items.length) * 100)}%)"}'}
`;
    }

    fs.writeFileSync(functionsPath + "/update_progress.mcfunction", content);

    // create update area function
    function formatNum(num) {
        if (num < 1000) return num;
        if (num < 10000) return Math.round(num / 100) / 10 + "k";
        if (num < 100000) return Math.round(num / 100) / 10 + "k";
        if (num < 1000000) return Math.round(num / 1000) + "k";
        if (num < 10000000) return Math.round(num / 10000) / 100 + "M";
        if (num < 100000000) return Math.round(num / 100000) / 10 + "M";
        if (num < 1000000000) return Math.round(num / 100000) / 10 + "M";
    }

    content = "";
    const max = (2 * items.length + 1) ** 2;
    for (let i = 0; i <= items.length; i++) {
        let num = (2 * i + 1) ** 2;
        content += `execute if score border sys matches ${i} run data merge entity @s {text:'{"text":"Area Unlocked: ${formatNum(
            num
        )}/${formatNum(max)} (${oneDecimal((num / max) * 100)}%)"}'}
`;
    }

    fs.writeFileSync(functionsPath + "/update_area.mcfunction", content);

    // create join lobby function
    content = `scoreboard objectives add in_lobby dummy
scoreboard players reset @a lobby
execute as @s[tag=!lobby] at @s if dimension minecraft:the_nether run tellraw @s {"text":"You can't enter the lobby while in the nether.","color":"red"}
execute as @s[tag=!lobby] at @s if dimension minecraft:the_end run tellraw @s {"text":"You can't enter the lobby while in the end.","color":"red"}
`;
    for (let i = 1; i <= 16; i++) {
        content += `execute as @s[tag=!lobby] at @s if dimension minecraft:overworld unless score ${i} in_lobby matches 1 run function simondmc:lobby/join_lobby_${i}
execute unless entity @e[tag=pos_hold_${i}] at @s if dimension minecraft:overworld run summon marker ~ ~ ~ {Tags:["pos_hold_${i}"]}
`;
    }

    fs.writeFileSync(functionsPath + "/join_lobby.mcfunction", content);

    // create leave lobby function
    content = "";

    for (let i = 1; i <= 16; i++) {
        content += `execute as @s[tag=lobby_${i}] run function simondmc:lobby/leave_lobby_${i}
`;
    }

    fs.writeFileSync(functionsPath + "/leave_lobby.mcfunction", content);

    // create join lobby functions
    for (let i = 1; i <= 16; i++) {
        const BARREL_1 = `244 -55 ${420 + i}`;
        const BARREL_2 = `245 -55 ${420 + i}`;
        content = `tag @s add lobby
tag @s add lobby_${i}
scoreboard players set ${i} in_lobby 1
`;
        for (let j = 0; j < 27; j++) {
            content += `item replace block ${BARREL_1} container.${j} from entity @s inventory.${j}
`;
        }

        for (let j = 0; j < 9; j++) {
            content += `item replace block ${BARREL_2} container.${j} from entity @s hotbar.${j}
`;
        }
        content += `item replace block ${BARREL_2} container.9 from entity @s armor.head
item replace block ${BARREL_2} container.10 from entity @s armor.chest
item replace block ${BARREL_2} container.11 from entity @s armor.legs
item replace block ${BARREL_2} container.12 from entity @s armor.feet
item replace block ${BARREL_2} container.13 from entity @s weapon.offhand
clear @s
scoreboard players operation ${i}_health in_lobby = @s health
scoreboard players operation ${i}_food in_lobby = @s food
effect give @s regeneration infinite 10 true
effect give @s resistance infinite 10 true
team join lobby @s
execute at @s as @e[distance=..5] run data merge entity @s {PersistenceRequired:1b}
tp @e[tag=pos_hold_${i}] @s
tp @s ${LOBBY_POS} 0 0
execute at @s run playsound entity.enderman.teleport master @s
gamemode adventure @s
scoreboard players reset @s open_chest
`;

        fs.writeFileSync(lobbyPath + `/join_lobby_${i}.mcfunction`, content);

        // create leave lobby functions
        content = `tag @s remove lobby
tag @s remove lobby_${i}
scoreboard players set ${i} in_lobby 0
`;
        for (let j = 0; j < 27; j++) {
            content += `item replace entity @s inventory.${j} from block ${BARREL_1} container.${j}
`;
        }

        for (let j = 0; j < 9; j++) {
            content += `item replace entity @s hotbar.${j} from block ${BARREL_2} container.${j}
`;
        }
        content += `item replace entity @s armor.head from block ${BARREL_2} container.9
item replace entity @s armor.chest from block ${BARREL_2} container.10
item replace entity @s armor.legs from block ${BARREL_2} container.11
item replace entity @s armor.feet from block ${BARREL_2} container.12
item replace entity @s weapon.offhand from block ${BARREL_2} container.13
effect clear @s resistance
`;
        for (let j = 0; j <= 20; j++) {
            content += `execute if score ${i}_health in_lobby matches ${j} run damage @s ${Math.min(
                19,
                20 - j
            )}
`;
        }
        content += `effect clear @s regeneration
team leave @s
tp @s @e[tag=pos_hold_${i},limit=1]
execute at @s as @e[distance=..10] run data merge entity @s {PersistenceRequired:0b}
execute at @s run playsound entity.enderman.teleport master @s
gamemode survival @s
`;

        fs.writeFileSync(lobbyPath + `/leave_lobby_${i}.mcfunction`, content);
    }

    // create check food function
    content = "";
    for (let i = 1; i <= 16; i++) {
        content += `execute as @a[tag=lobby_${i}] if score @s food < ${i}_food in_lobby run effect give @s saturation 1 0 true
`;
    }

    fs.writeFileSync(functionsPath + "/check_food.mcfunction", content);
}
