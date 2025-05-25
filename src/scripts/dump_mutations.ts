import { writeFile } from 'fs/promises';
import { DEV_MUTATIONS, MUTATION_COLOR_OVERRIDES } from '../Constants.js';
import { getFile } from '../DataParser.js';
import { meta } from '../Meta.js';
import { MutationsLibrary } from '../types/Mutations.js';

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

function addMutation(name: string, color: string) {
	const cls = name.toLowerCase().replaceAll(' ', '-').replaceAll(/[’']/g, '')
	css.push(`.mutation-${cls}, .mutation-${cls} a:not(.new), .mutation-${cls} .oo-ui-labelElement-label { color: #${color}; }`)
}

for (const [mutationName, mutation] of Object.entries(mutations.Mutations).sort(([,m0], [,m1]) => m0.Display.localeCompare(m1.Display))) {
	if (DEV_MUTATIONS.includes(mutation.Display)) continue
	const color = MUTATION_COLOR_OVERRIDES[mutationName] ?? mutation.Color.toHex()
	
	addMutation(mutation.Display, color)
	
	if (mutation.Display != mutationName) {
		addMutation(mutationName, color)
	}
}

await writeFile('./output/mutations.css', css.join('\n'))