scoreboard objectives add lobby trigger
scoreboard objectives add health health
scoreboard objectives add food food

# test for activation
execute as @a[tag=!lobby] if score @s lobby matches 1.. run function simondmc:join_lobby

execute if score border sys matches 10.. run scoreboard players enable @a[tag=!lobby] lobby

execute if entity @a[tag=lobby] run function simondmc:lobby

# tp out of lobby if not in lobby
execute as @a[tag=!lobby] if predicate simondmc:in_lobby run tp @s 241 71 428 0 0

# timer
scoreboard objectives add timer dummy
execute unless score minutes timer matches 0.. run scoreboard players set minutes timer 0
execute unless score hours timer matches 0.. run scoreboard players set hours timer 0
# only increase timer if not all players in lobby
execute if entity @a[tag=player,tag=!lobby] run scoreboard players add ticks timer 1
execute if score ticks timer matches 20 run scoreboard players add seconds timer 1
execute if score ticks timer matches 20 run scoreboard players set ticks timer 0
execute if score seconds timer matches 60 run scoreboard players add minutes timer 1
execute if score seconds timer matches 60 run scoreboard players set seconds timer 0
execute if score minutes timer matches 60 run scoreboard players add hours timer 1
execute if score minutes timer matches 60 run scoreboard players set minutes timer 0

# prevent time from advancing when all players in lobby
execute if entity @a[tag=player,tag=!lobby] run gamerule doDaylightCycle true
execute unless entity @a[tag=player,tag=!lobby] run gamerule doDaylightCycle false

# death pooling
scoreboard objectives add deaths deathCount
execute unless score $total deaths matches 0.. run scoreboard players set $total deaths 0
execute as @a if score @s deaths matches 1.. run scoreboard players operation $total deaths += @s deaths 
execute as @a if score @s deaths matches 1.. run scoreboard players reset @s deaths

# setup on join
scoreboard objectives add sys dummy
execute unless score setup sys matches 1 run function simondmc:index

# Version Updater
#
# With every update, increment the version score in the 3 commands below (six `matches` and one `scoreboard players set`)
# and change the version name in the tellraw
#
# ALSO ver_inf is set in core.js so change it there too !!!!

execute if entity @a unless score ver sys matches 3 unless score ver_inf sys matches 3 run tellraw @a ["",{"text":"---------------------------------------------","bold":true,"strikethrough":true,"color":"gold"},{"text":"\n"},{"text":" \u0020 \u0020 \u0020 \u0020 \u0020 \u0020 \u0020 \u0020 \u0020 \u0020 \u0020 \u0020 \u0020 \u0020 Border Hoarder","color":"green"},{"text":"\n\n"},{"text":" \u0020 \u0020 \u0020 \u0020 \u0020 \u0020 \u0020Successfully updated to ","bold":true,"color":"yellow"},{"text":"v1.3","bold":true,"color":"green"},{"text":"!","bold":true,"color":"yellow"},{"text":"\n\n"},{"text":"---------------------------------------------","bold":true,"strikethrough":true,"color":"gold"}]
execute if entity @a unless score ver sys matches 3 unless score ver_inf sys matches 3 as @a at @s run playsound entity.player.levelup master @s
execute if entity @a unless score ver sys matches 3 unless score ver_inf sys matches 3 run scoreboard players set ver_inf sys 3
gamemode survival @a[tag=!player]
advancement revoke @a[tag=!player] everything
spawnpoint @a[tag=!player] 241 71 428
scoreboard players set @a[tag=!player] p_items 0
tellraw @a[tag=!player] ["",{"text":"---------------------------------------------","bold":true,"strikethrough":true,"color":"gold"},{"text":"\n                    "},{"text":"Welcome to ","color":"yellow"},{"text":"Border Hoarder","bold":true,"color":"green"},{"text":"!","color":"yellow"},{"text":"\n\n             "},{"text":"Collect unique items to expand the border.","color":"aqua"},{"text":"\n         "},{"text":"Once you reach 10 items, you'll unlock the lobby,\n         where you can view your progression, stats and","color":"#C1BFFF"},{"text":"\n                             "},{"text":"remaining items.","color":"#C1BFFF"},{"text":"\n\n                                "},{"text":"Have fun!","color":"gold"},{"text":"\n"},{"text":"---------------------------------------------","bold":true,"strikethrough":true,"color":"gold"}]
execute as @a[tag=!player] at @s run playsound entity.player.levelup master @s
tag @a add player

# gate warning
execute in minecraft:the_end if block 0 65 0 minecraft:dragon_egg unless score gates sys matches 1 run tellraw @a ["",{"text":"Watch out for the ","color":"gold"},{"text":"End Gateways","color":"light_purple"},{"text":"! If you go through one, there is a very high chance you'll end up outside the border and ","color":"gold"},{"text":"die immediately","color":"red"},{"text":". There is an ","color":"gold"},{"text":"End City","color":"light_purple"},{"text":" within the border, but you'll have to make a bridge to it.","color":"gold"}]
execute in minecraft:the_end if block 0 65 0 minecraft:dragon_egg unless score gates sys matches 1 run scoreboard players set gates sys 1