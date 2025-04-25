import { writeFile } from 'fs/promises';
import { createHash } from 'node:crypto';
import { DEV_TITLE_HASHES } from '../Constants.js';
import { getFile } from '../DataParser.js';
import { meta } from '../Meta.js';
import { TitlesLibrary } from '../types/titles.js';
import { ColorSequence } from '../util/Color.js';

const WEIGHT_MAP = {
	Thin: 100,
	ExtraLight: 200,
	Light: 300,
	Regular: 400,
	Medium: 500,
	SemiBold: 600,
	Bold: 700,
	ExtraBold: 800,
	Heavy: 900,
}

const titles: TitlesLibrary = await getFile('titles.json')
const out: string[] = [
	`/* Last update: Version [[${meta.official_version}]], place version ${meta.place_version} */`,
	'',
	`.playertitle {`,
	`\tfont-family: 'Source Sans Pro', sans-serif;`,
	`\tfont-size: 1.10em;`,
	`\tcolor: var(--playertitle-color);`,
	`\ttext-shadow: 1px 1px 0 var(--playertitle-stroke-color), -1px 1px 0 var(--playertitle-stroke-color), -1px -1px 0 var(--playertitle-stroke-color), 1px -1px 0 var(--playertitle-stroke-color);`,
	`}`,
	'',
	'.playertitle- {',
	'\t--playertitle-color: white;',
	'}',
]

function hash(str: string) {
	return createHash('sha1').update(str).digest('hex')
}

for (const [internal, title] of Object.entries(titles).sort(([, n0], [, n1]) => n0.Text.localeCompare(n1.Text))) {
	if (DEV_TITLE_HASHES.includes(hash(internal)) || DEV_TITLE_HASHES.includes(hash(title.Text))) continue
	
	let id = title.Text.toLowerCase().replaceAll(/[^\w\- ]/g, '').trim().replaceAll(' ', '-')
	if (!id) continue // skip emoji-only titles
	
	out.push(`.playertitle-${id} {`)
	if (title.TextColor instanceof ColorSequence) {
		out.push(`\tbackground: ${title.TextColor.toCSSGradient(title.GradientRotation ? (title.GradientRotation + 90) : -45)};`)
	} else {
		out.push(
			`\t--playertitle-color: #${title.TextColor.toHex()};`,
			`\t--playertitle-stroke-color: #${title.StrokeColor.toHex()};`
		)
	}
	if (title.CustomFont) {
		out.push(`\tfont-family: '${title.CustomFont.Family.replace('rbxasset://fonts/families/', '').replace('.json', '')}';`)
		if (title.CustomFont.Weight != 'Regular') {
			out.push(`\tfont-weight: ${WEIGHT_MAP[title.CustomFont.Weight]};`)
		}
		if (title.CustomFont.Style != 'Normal') {
			out.push(`\tfont-style: ${title.CustomFont.Style.toLowerCase()};`)
		}
	} else {
		if (title.Bold) {
			out.push(`\tfont-weight: 700;`)
		}
		if (title.Italic) {
			out.push(`\tfont-style: italic;`)
		}
	}
	out.push('}')
}

await writeFile('./output/titles.css', out.join('\n'))