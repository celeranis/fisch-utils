import { writeFile } from 'fs/promises';
import { getFile } from '../DataParser.js';
import { meta } from '../Meta.js';
import { EnchantsLibrary } from '../types/enchants.js';

const enchants: EnchantsLibrary = await getFile('enchants.json')
const css: string[] = [
	`/* Last update: Version [[${meta.official_version}]], place version ${meta.place_version} */`,
	''
]

for (const enchant of Object.values(enchants.Enchants)) {
	const cls = enchant.Display.toLowerCase().replaceAll(' ', '-')
	css.push(`.enchantment-${cls} { --enchant-color: #${enchant.Color.toHex()}; }`)
}

css.push(
	'',
	`.enchantment, .enchantment a, .enchantment-option .oo-ui-labelElement-label { color: var(--enchant-color) }`
)

await writeFile('./output/enchants.css', css.join('\n'))