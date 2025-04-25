import { setTimeout } from 'timers/promises';
import { Fish } from '../Fish.js';
import { meta } from '../Meta.js';
import { client } from '../util/Bot.js';
// import { roundTo } from '../util/General.js';

const fishPages = (await client.getPagesInCategory('Fish'))
	.filter(page => !page.startsWith('Category:'))
const fishData = Fish.loadAll()

const SKIP: string[] = [
	// 'Tire',
	// 'Scallop',
	// 'Frozen Walnut'
]

const ONLY: string[] = [
	
]

async function updatePage(page: string) {
	if (SKIP.includes(page)) return
	if (ONLY.length > 0 && !ONLY.includes(page)) return
	const fish = fishData.find(fish => fish.Name == page)
	if (!fish) return console.error(`wtf is a ${page}`)
	await client.edit(page, (rev => {
		let originalContent = rev.content

		const wikitext = new client.Wikitext(rev.content)
		const availabilityTemplate = wikitext.parseTemplates({ namePredicate: (name: string) => name == 'Fish Availability' }).find(template => template.name == 'Fish Availability')
		
		let newContent = rev.content
			.replace(/\{\{Fish Availability\|.+?\}\}/si, fish.getAvailabilityCall(availabilityTemplate?.getParam('recommended')?.value?.split('; ')?.map(r => r.trim())).join('\n'))
			
		if (originalContent == newContent) return null as any

		return {
			text: newContent,
			summary: `updating conditions for [[${meta.official_version}]]-${meta.place_version}`
		}
	})).catch(async err => {
		if (err?.code == 'ratelimited') {
			console.log('ratelimited, waiting 10s')
			await setTimeout(10_000)
			await updatePage(page)
		} else throw err
	})
}

for (const [i, page] of fishPages.entries()) {
	await updatePage(page)
	console.log(`[${i}/${fishPages.length}] Updated page for ${page}`)
}