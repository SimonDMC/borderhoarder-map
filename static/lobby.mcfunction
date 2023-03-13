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