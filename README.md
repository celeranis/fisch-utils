# fisch-utils
A collection of tools used to maintain the [Official Fisch Wiki](https://fischipedia.org/wiki/Fisch_Wiki).

Due to copyright concerns, game data itself will not be included in this repository, but the tools have been included to format it for this project.

## Setup
To begin setting up this project, you will need [Node.js](https://nodejs.org/en/download) 20 and a node package manager (this repository was build for [pnpm](https://pnpm.io/), but regular npm should work fine too).

Once those have been installed, simply run `pnpm i` or `npm i` to install the needed dependencies.

Finally, run `tsc` to compile the project. Do not mind the error coming from the mwn dependency folder — I do not believe this can be fixed.

### Getting Game Data
The contents of the `data` folder are not provided and must be obtained yourself through game decompilation or otherwise.

Once an RBXL for the game has been obtained:
* Run `node src/scripts/waitdata` in your terminal.
* Open the RBXL in Roblox Studio and paste the contents of `src/lua/dump_data.lua` into the Command Bar.
  * The Command Bar may first need to be enabled from the View tab at the top of Studio.
* Check the terminal for file names and the contents of the corresponding entries in the `data` folder.
Once all the needed data has been obtained, press Ctrl+C to exit the `waitdata` script. You may also close Roblox Studio.

## Usage
The following scripts are most commonly used, and have fairly straightforward names:
* `src/scripts/dump_fish.js` — Populates `output/fish`, as well as generating `CalcData.json`, `NavboxData.lua`, `BestiaryOrder.lua`, and `RarityData.lua`.
  * Including the `--skip-pages` argument will only generate `CalcData.json`.
* `src/scripts/dump_bait.js` — Populates `output/bait`.
* `src/scripts/dump_bobbers.js` — Generates `BobberData.lua`.
* `src/scripts/dump_enchants.js` — Generates `enchants.css`.
* `src/scripts/dump_mutations.js` — Generates `mutations.css`.
* `src/scripts/dump_rods.js` — Generates `rodstles.css`.
* `src/scripts/dump_titles.js` — Generates `titles.css`.

Each of these can be run by simply entering `node` followed by the script path into your terminal. Alternatively, 

### Bot Usage
Two common scripts require additional configuration for a bot account on the wiki itself.

The first one, `src/scripts/update_availability.js`, can be used to update the "Recommended Conditions" for fish on the wiki automatically.

The second one, `src/scripts/auto_update.js`, can be used to post new update content to the wiki:
* The latest generated version of the following files will be posted, if possible:
  * `CalcData.json` → [`MediaWiki:FischTools-Data.json`](https://fischipedia.org/wiki/MediaWiki:FischTools-Data.json)
  * `BestiaryOrder.lua` → [`Module:Bestiary Order/data`](https://fischipedia.org/wiki/Module:Bestiary_Order/data)
  * `NavboxData.lua` → [`Module:Fish Navbox/data`](https://fischipedia.org/wiki/Module:Fish_Navbox/data)
  * `RarityData.lua` → [`Module:Item/fish`](https://fischipedia.org/wiki/Module:Item/fish)
  * `BobberData.lua` → [`Module:Item/bobbers`](https://fischipedia.org/wiki/Module:Item/bobbers)
  * `rodstyles.css` → [`Template:Item/styles.css`](https://fischipedia.org/wiki/Template:Item/styles.css)
  * `mutations.css` → [`Template:Mutation/styles.css`](https://fischipedia.org/wiki/Template:Mutation/styles.css)
  * `titles.css` → [`Template:PlayerTitle/styles.css`](https://fischipedia.org/wiki/Template:PlayerTitle/styles.css)
* The contents of `src/scripts/newfish` will be posted to pages of the same name.
  * Results in the `output/fish` folder may be copied and pasted directly into here.

Both of these require a `config.json` to be created with credentials from [Special:BotPasswords](https://fischipedia.org/wiki/Special:BotPasswords). For an example of how this should be formatted, see `config.example.json`.

## Editing
Due to *Fisch*'s... unique codebase, in addition to some inaccessible server-sided behavior, some parts of this tool must be updated manually.

**After saving any changes, you must run `tsc` in the terminal to rebuild the project.** You can also run `tsc --watch` to automatically rebuild the project whenever files are saved.

Common places to edit include:
* `src/Constants.ts` — Contains several constants which are changed nearly every update:
  * `DISPLAY_LOCATIONS` — A map of Bestiary location names to their full/corrected ones.
  * `ZONE_DISPLAY` — A map of internal fishing zone names to unofficial user-facing ones. Forward slashes are replaced with hyphens or colons by the wiki's templates.
  * `IGNORE_ZONES` — Fishing locations that cannot be directly fished into or wormholed. Unless referenced again elsewhere, these zones will be entirely ignored.
  * `UNFISHABLE_ZONES` — Fishing locations that cannot be directly fished into, but are still included by Wormhole.
  * `locationRefer` — A map of Bestiary locations to a corresponding blurb of text in the page introduction.
  * `EVENT_MAP` — Used to map multiple Bestiary locations to a single associated event.
  * `RECOMMENDED_RODS` — Rods that should *always* be included in Recommended Conditions if they can catch the target fish.
  * `LIMITED_POOLS` — Used to filter out unavailable event pools from Recommended Conditions calculations.
  * `AVOID_POOLS` — Similar to `LIMITED_POOLS`, but for ones that are still available — just relatively hard to encounter.
  * `AVOID_RODS` — Fishing Rods exclusive to developers or content creators that should not appear in Recommended Conditions.
  * `LIMITED_BAIT` — Bait types that should be avoided in Recommended Conditions due to exceptionally difficult obtainment criteria.
  * `HARDCODED_PENALTIES` — See the wiki's Luck page for more information.
  * `ZONE_ABUNDANCE_MAP` — A map of fishing location names to Abundances that are always present in them. Useful as some event pools (such as Ancient Depth serpent) will often not appear in decompilations.
  * `DEV_OVERRIDES` — Used to override the "DEV" parameter in Fishing Rod data when determining whether a certain rod is exclusive to developers and admins.
  * `ROD_COLOR_OVERRIDES` — Overrides the text color of specific Fishing Rods if the original was unreadable or overused.
  * `MUTATION_COLOR_OVERRIDES` — Overrides the text color of specific Mutations if the original was unreadable or overused.
  * `crabZoneMap` — Used to map Crab Cage zones to user-facing names. This is rarely updated in practice, as Crab Cages have largely been abandoned by the developers.
  * `OVERRIDE_SEA` — Used to override the sea associated with a certain fishing location. This is typically only needed for event pools such as the Sea Leviathan Hunt. If unspecified here, these pools will instead be considered to be part of the First Sea.
  * `DEV_TITLE_HASHES` — sha1 hashes of developer/admin-exclusive titles. Anything that matches these will not be included in script output.
* `src/util/MutationCalcData.ts` — Includes the chances and conditions for catching mutations.
* `src/FishingRods.ts` — Includes data on most Fishing Rods' passives if they are supported by the calculator.
* `src/Enchant.ts` — Includes data on Enchantment abilities if they are supported by the calculator.

## Disclaimer
This project is no longer planned to receive any major updates from me — just maintenance as needed.
