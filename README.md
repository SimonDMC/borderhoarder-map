# BorderHoarder

This is an adaptation of my [BorderHoarder plugin](https://github.com/SimonDMC/BorderHoarder)
as a vanilla survival map. Some features have been removed or altered due to vanilla
limitations and project scope.

## Repository

As the world is static, this repository only contains the datapack for the map along with
all the scripts used to generate it. The map has not been released yet.

## Why JavaScript

Due to Minecraft datapack limitations, writing a generator for functions, advancements and
loot tables is a lot easier than making each file manually. It also allows for some
preprocessing (such as percentages in stats)

## Files

-   `generate.js` is the main script which calls all the others
-   `wipe.js` deletes the entire data/ folder for a fresh install
-   `core.js` handles the generation of core systems for the border expanding system to work
-   `chest.js` handles the generation of scripts related to the missing items chest in the lobby
-   `lobby.js` handles the generation of scripts powering all lobby systems and entering/exiting
-   `items.js` contains the item list for use in other scripts
-   `time.js` is a utility script for timing datapack generation segments
