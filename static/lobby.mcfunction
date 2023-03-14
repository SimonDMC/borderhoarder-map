# exit lobby
execute if entity @a[x=242,y=-61,z=420,dx=-3] run function simondmc:exit_lobby

# update stats
execute as @e[tag=stat_1] run function simondmc:update_progress

execute as @e[tag=stat_3] run data merge entity @s {text:'[{"text":"Playtime: "},{"score":{"name":"hours","objective":"timer"}},{"text":"h "},{"score":{"name":"minutes","objective":"timer"}},{"text":"m"}]'}

execute as @e[tag=stat_4] run data merge entity @s {text:'[{"text":"Deaths: "},{"score":{"name":"$total","objective":"deaths"}}]'}

# reset missing items view
scoreboard objectives add open_chest custom:open_chest
execute as @a if score @s open_chest matches 1.. if entity @s[tag=lobby] run scoreboard players set last_page sys 0
execute as @a if score @s open_chest matches 1.. if entity @s[tag=lobby] run scoreboard players set last_page_item sys 0
execute as @a if score @s open_chest matches 1.. if entity @s[tag=lobby] run function simondmc:fill_chest

# update chest check
function simondmc:check_chest

# right click armor stand
execute as @e[tag=stand_interact] unless data entity @s {interaction:{timestamp:0L}} on target run function simondmc:click_stand
execute as @e[tag=stand_interact] run data merge entity @s {interaction:{timestamp:0}}

# left click blocks
execute as @e[tag=small_block_int_1] unless data entity @s {attack:{timestamp:0L}} run scoreboard players add block_1_spin sys 20
execute as @e[tag=small_block_int_1] run data merge entity @s {attack:{timestamp:0}}
execute as @e[tag=small_block_int_2] unless data entity @s {attack:{timestamp:0L}} run scoreboard players add block_2_spin sys 20
execute as @e[tag=small_block_int_2] run data merge entity @s {attack:{timestamp:0}}
execute as @e[tag=small_block_int_3] unless data entity @s {attack:{timestamp:0L}} run scoreboard players add block_3_spin sys 20
execute as @e[tag=small_block_int_3] run data merge entity @s {attack:{timestamp:0}}
execute as @e[tag=small_block_int_4] unless data entity @s {attack:{timestamp:0L}} run scoreboard players add block_4_spin sys 20
execute as @e[tag=small_block_int_4] run data merge entity @s {attack:{timestamp:0}}

# block spinning
function simondmc:spin_blocks