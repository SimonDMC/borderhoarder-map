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
        content += `execute if score block_${i}_spin sys matches 19.. as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~50 ~
execute if score block_${i}_spin sys matches 17..18 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~45 ~
execute if score block_${i}_spin sys matches 15..16 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~40 ~
execute if score block_${i}_spin sys matches 13..14 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~35 ~
execute if score block_${i}_spin sys matches 11..12 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~30 ~
execute if score block_${i}_spin sys matches 9..10 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~25 ~
execute if score block_${i}_spin sys matches 7..8 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~20 ~
execute if score block_${i}_spin sys matches 5..6 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~15 ~
execute if score block_${i}_spin sys matches 3..4 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~10 ~
execute if score block_${i}_spin sys matches 1..2 as @e[tag=small_block_${i}] at @s run tp @s ~ ~ ~ ~5 ~
execute if score block_${i}_spin sys matches 1.. run scoreboard players add block_${i}_spin sys -1
`;
    }

    fs.writeFileSync(functionsPath + "/spin_blocks.mcfunction", content);

    // create update progress function
    content = "";
    for (let i = 0; i < items.length; i++) {
        content += `execute if score border sys matches ${i} run data merge @s {text:'{"text":"Items Collected: ${i}/${
            items.length
        } (${Math.round((i / items.length) * 1000) / 10}%)"}'}
`;
    }

    fs.writeFileSync(functionsPath + "/update_progress.mcfunction", content);

    // create join lobby function
    content = `scoreboard objectives add in_lobby dummy
`;
    for (let i = 1; i <= 16; i++) {
        let chain = "";
        for (let j = 1; j <= i; j++) {
            chain += `unless score ${j} in_lobby matches 1 `;
        }
        content += `execute as @s[tag=!lobby] ${chain}run function simondmc:lobby/join_lobby_${i}
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
effect give @s regeneration infinite 10 true
tp @e[tag=pos_holder_${i}] @s
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
`;
        for (let j = 0; j <= 20; j++) {
            content += `execute if score ${i}_health in_lobby matches ${j} run damage @s ${Math.min(
                19,
                20 - j
            )}
`;
        }
        content += `effect clear @s regeneration
tp @s @e[tag=pos_holder_${i}]
execute at @s run playsound entity.enderman.teleport master @s
gamemode survival @s
`;

        fs.writeFileSync(lobbyPath + `/leave_lobby_${i}.mcfunction`, content);
    }
}
