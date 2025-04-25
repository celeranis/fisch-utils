import { writeFileSync } from 'node:fs';
import { getFile } from '../DataParser.js';
import { meta } from '../Meta.js';
import { BobberLibrary } from '../types/bobbers.js';
import { jsonToLua } from '../util/LuaObject.js';

const bobbers: BobberLibrary = await getFile('bobbers.json')

const bobberData = {}

for (const [name, bobber] of Object.entries(bobbers.Bobbers).sort(([b], [b1]) => b.localeCompare(b1))) {
	bobberData[name] = bobber.Rarity
}

writeFileSync('./output/BobberData.lua', `-- Last update: Version [[${meta.official_version}]], place version ${meta.place_version}\n\nreturn ` + jsonToLua(bobberData))