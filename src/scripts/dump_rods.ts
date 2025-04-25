import { writeFile } from 'node:fs/promises';
import { ROD_COLOR_OVERRIDES } from '../Constants.js';
import { FishingRod } from '../FishingRod.js';
import { meta } from '../Meta.js';

const css: string[] = [
	'.item {',
	'	display: inline-flex;',
	'	align-items: center;',
	'	line-height: normal;',
	'	gap: 3px;',
	'	vertical-align: text-top;',
	'}',
	'',
	'.item .item-icon {',
	'	display: inline-flex;',
	'	align-content: center;',
	'}',
	'',
	'.item .item-icon span[typeof="mw:File"] {',
	'	display: inline-block;',
	'	margin: auto;',
	'	line-height: 0;',
	'}',
	'',
	'.item .item-icon img {',
	'	filter: drop-shadow(0 0 2px black);',
	'}',
	'',
	'.item-text > a {',
	'	font-weight: 500;',
	'}',
	'',
	'.item-icon > span[typeof="mw:Error mw:File"] {',
	'	display: none;',
	'}',
	'',
	'/* The following is auto-generated based on in-game data */',
	`/* Last update: Version [[${meta.official_version}]], place version ${meta.place_version} */`,
	'',
]

for (const rod of FishingRod.getNonDev().sort((f0, f1) => f0.Name.localeCompare(f1.Name))) {
	const cls = rod.Name.toLowerCase().replaceAll(' ', '-').replaceAll(/[^\w\-]/g, '')
	const color = ROD_COLOR_OVERRIDES[rod.Name] ?? rod.Color
	css.push(`.item-${cls} { --item-color: ${color.toRGBVar()}; --item-bg-color: ${color.toRGBVar(7)} }`)
}

css.push(
	'',
	'',
	'.item.no-rarity a,',
	'.rod-navbox-entry a,',
	'.rod-option .oo-ui-labelElement-label {',
	'	color: rgb(var(--item-color));',
	'}',
	'',
	'span.fish-navbox-entry.rod-navbox-entry {',
	'	background-color: rgb(var(--item-bg-color));',
	'	border-color: rgb(var(--item-color));',
	'}',
)

writeFile('./output/rodstyles.css', css.join('\n'))