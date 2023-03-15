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
# online check
execute if entity @a[tag=player] run scoreboard players add ticks timer 1
execute if score ticks timer matches 20 run scoreboard players add seconds timer 1
execute if score ticks timer matches 20 run scoreboard players set ticks timer 0
execute if score seconds timer matches 60 run scoreboard players add minutes timer 1
execute if score seconds timer matches 60 run scoreboard players set seconds timer 0
execute if score minutes timer matches 60 run scoreboard players add hours timer 1
execute if score minutes timer matches 60 run scoreboard players set minutes timer 0

# death pooling
scoreboard objectives add deaths deathCount
execute unless score $total deaths matches 0.. run scoreboard players set $total deaths 0
execute as @a if score @s deaths matches 1.. run scoreboard players operation $total deaths += @s deaths 
execute as @a if score @s deaths matches 1.. run scoreboard players reset @s deaths

# setup 
tag @a add player
gamerule randomTickSpeed 3
gamerule doDaylightCycle true

# gate warning
execute in minecraft:the_end if block 0 65 0 minecraft:dragon_egg unless score gates sys matches 1 run tellraw @a ["",{"text":"Watch out for the ","color":"gold"},{"text":"End Gateways","color":"light_purple"},{"text":"! If you go through one, there is a very high chance you'll end up outside the border and ","color":"gold"},{"text":"die immediately","color":"red"},{"text":". There is an ","color":"gold"},{"text":"End City","color":"light_purple"},{"text":" within the border, but you'll have to make a bridge to it.","color":"gold"}]
execute in minecraft:the_end if block 0 65 0 minecraft:dragon_egg unless score gates sys matches 1 run scoreboard players set gates sys 1