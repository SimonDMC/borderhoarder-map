scoreboard objectives add lobby trigger
scoreboard objectives add health health
scoreboard objectives add food food

# test for activation
execute as @a[tag=!lobby] if score @s lobby matches 1.. run function simondmc:join_lobby

execute if score border sys matches 10.. run scoreboard players enable @a[tag=!lobby] lobby

execute if entity @a[tag=lobby] run function simondmc:lobby

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
gamerule sendCommandFeedback false