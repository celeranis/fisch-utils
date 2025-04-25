import { setTimeout } from 'timers/promises';
import { Fish } from '../Fish.js';
import { client } from '../util/Bot.js';
// import { roundTo } from '../util/General.js';

const fishPages = await client.getPagesInCategory('Fish')
const fishData = Fish.loadAll()

async function updatePage(page: string) {
	const fish = fishData.find(fish => fish.Name == page)
	if (!fish) throw new Error(`wtf is a ${page}`)
	await client.edit(page, (rev => {
		let originalContent = rev.content
		let newContent = rev.content
			.replace(/\|base_weight\s+=.+?\n}}/s, `|base_weight    = ${fish.WeightPool[1] / 10}\n|base_value     = ${fish.Price}\n|weight_range   = ${fish.getRange()}\n|base_chance    = ${fish.Chance}\n|base_resil     = ${fish.Resilience}\n}}`)
			
		if (originalContent == newContent) return null as any

		return {
			text: newContent,
			summary: `adding base resilience`
		}
	})).catch(async err => {
		if (err?.code == 'ratelimited') {
			console.log('ratelimited, waiting 10s')
			await setTimeout(10_000)
			await updatePage(page)
		} else throw err
	})
}

for (const page of fishPages) {
	if (page.startsWith('Category:')) continue
	
	await updatePage(page)
}