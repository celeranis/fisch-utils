import { writeFileSync } from 'node:fs';
import { getFile } from '../DataParser.js';
import { meta } from '../Meta.js';
import { RodSkinsLibrary } from '../types/RodSkins.js';
import { jsonToLua } from '../util/LuaObject.js';

const rodSkins: RodSkinsLibrary = await getFile('RodSkins.json')

const rodSkinData = {}

for (const [name, rodSkin] of Object.entries(rodSkins.Skins).sort(([b], [b1]) => b.localeCompare(b1))) {
    if (rodSkin.DisplayText) {
        rodSkinData[rodSkin.DisplayText] = rodSkin.Rarity;
    } else rodSkinData[name] = rodSkin.Rarity    
}

writeFileSync('./output/RodSkinData.lua', `-- Last update: Version [[${meta.official_version}]], place version ${meta.place_version}\n\nreturn ` + jsonToLua(rodSkinData))