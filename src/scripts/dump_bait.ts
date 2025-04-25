import { writeFile } from 'fs/promises';
import { Bait } from '../Bait.js';
import { Fish } from '../Fish.js';
import { meta } from '../Meta.js';
import { a, roundTo } from '../util/General.js';
import { jsonToLua } from '../util/LuaObject.js';
import { Template } from '../util/Template.js';

const baitRarities: [string, string][] = []

for (const bait of Bait.loadAll()) {
	const page: string[] = []
	
	baitRarities.push([bait.name, bait.rarity])
	
	const crates = bait.getCrateSources()
	
	page.push(
		new Template('BaitInfobox', {
			name: Fish.fromName(bait.name) ? bait.name : undefined,
			image: `Bait ${bait.name}.png`,
			rarity: bait.rarity,
			crates: Object.entries(crates).map(([crate, avg]) => `${crate}/${roundTo(avg, 2)}`).join(', '),
			angler_quests: '<!--TBD-->',
			pref_luck: bait.preferred_luck || '',
			univ_luck: bait.universal_luck || '',
			resilience: bait.resilience || '',
			lure: bait.lure_speed || '',
			ability: ''
		}).block(14),
		`'''${bait.name}''' is ${a(bait.rarity)} {{Rarity|${bait.rarity}}} [[Bait]] that can be used in fishing.`,
		'',
		'== Obtainment ==',
		`${bait.name}s can be obtained in the following ways:`,
	)
	
	for (const [crate, avg] of Object.entries(crates)) {
		page.push(`* {{Item|${crate}}} (${roundTo(avg, 2)}/crate on average)`)
	}
	
	page.push(`<!--* [[Angler]] Quests, starting from the ?th completion-->`)
	
	page.push(
		'',
		'== Favoring Fish ==',
		`{{Fish by Category Table|${bait.name}-Loving Fish|event=1|show_location=1|hide_bait=1|resultsheader='''%PAGES%''' [[Fish]] prefer ${bait.name}s:|noresultsheader=No fish prefer ${bait.name}s.}}`,
		'',
		'== Change History ==',
		'{{Change History|1.0}}',
		'',
		'== Navigation ==',
		'{{Bait Navbox}}'
	)
	
	await writeFile(`./output/bait/${bait.name}.wikitext`, page.join('\n'))
}

await writeFile(`./output/BaitData.lua`, `-- Last update: Version [[${meta.official_version}]], place version ${meta.place_version}\n\nreturn ` + jsonToLua(Object.fromEntries(baitRarities.sort(([b0], [b1]) => b0.localeCompare(b1)))))