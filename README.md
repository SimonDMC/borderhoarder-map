# BorderHoarder - Map

This is a port of the [BorderHoarder plugin](https://github.com/SimonDMC/BorderHoarder)
as a vanilla Minecraft Map. Due to vanilla limitations it has a lot less features,
but the core of the game still works.

## Repository

As the world is static, this repository only houses the datapack for the map along with
all the scripts used to generate it. The map has not been released yet.

## Why JavaScript

Due to datapack limitations, it was a lot easier to write most of this as a generator
rather than directly copy/pasting all files. Also I like JS teehee

## Files

-   `wipe.js` wipes the whole datapack for a fresh generation
-   `generate.js` creates all the folders/files and writes their content
