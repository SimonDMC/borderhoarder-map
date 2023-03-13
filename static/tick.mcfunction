scoreboard objectives add lobby trigger

# test for activation
execute as @a if score @s lobby matches -2147483648..2147483647 run function simondmc:join_lobby

scoreboard players enable @a[tag=!lobby] lobby

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
execute as @a if score @s deaths matches 1.. run scoreboard players operation $total deaths += @s deaths 
execute as @a if score @s deaths matches 1.. run scoreboard players reset @s deaths