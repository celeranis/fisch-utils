import { writeFile } from 'fs/promises';
import { MUTATION_COLOR_OVERRIDES } from '../Constants.js';
import { getFile } from '../DataParser.js';
import { meta } from '../Meta.js';
import { MutationsLibrary } from '../types/Mutations.js';
import { DEV_MUTATIONS } from '../util/MutationCalcData.js';

const mutations: MutationsLibrary = await getFile('mutations.json')
const css: string[] = [
	`/* Last update: Version [[${meta.official_version}]], place version ${meta.place_version} */`,
	'',
	'/* Attributes */',
	`.mutation-big, .mutation-big a:not(.new), .mutation-giant, .mutation-giant a:not(.new) { color: #8bff89; }`,
	`.mutation-shiny, .mutation-shiny a:not(.new), .mutation-sparkling, .mutation-sparkling a:not(.new) { color: #fff0bc; }`,
	'',
	'/* Mutations */',
]

for (const [mutationName, mutation] of Object.entries(mutations.Mutations).sort(([n0], [n1]) => n0.localeCompare(n1))) {
	if (DEV_MUTATIONS.includes(mutation.Display)) continue
	const cls = mutationName.toLowerCase().replaceAll(' ', '-').replaceAll('’', '')
	css.push(`.mutation-${cls}, .mutation-${cls} a:not(.new), .mutation-${cls} .oo-ui-labelElement-label { color: #${MUTATION_COLOR_OVERRIDES[mutationName] ?? mutation.Color.toHex()}; }`)
}

await writeFile('./output/mutations.css', css.join('\n'))