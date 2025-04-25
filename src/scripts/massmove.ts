import { setTimeout } from 'timers/promises';
import { client } from '../util/Bot.js';

async function move(old: string, newTitle: string, summary: string) {
	await client.move(old, newTitle, summary)
		.catch(async err => {
			if (err?.code == 'ratelimited') {
				console.log('ratelimited, waiting 10s')
				await setTimeout(10_000)
				await move(old, newTitle, summary)
			} else if (err?.code == 'moderation-move-queued') {
				console.log('got moderated for some reason')
			}
			else throw err
		})
}

for (const page of await client.getPagesInCategory('Fishing Rods')) {
	const pageData = await client.read(page)
	if (!pageData?.revisions?.[0]?.content) continue
	
	const wikitext = new client.Wikitext(pageData.revisions[0].content)
	const infobox = wikitext.parseTemplates({ namePredicate: (name) => name == 'RodInfobox' })[0]
	const infoboxImage = infobox.getParam('image')
	
	if (!infoboxImage.value || infoboxImage.value == `${page}.png`) continue
	
	const imageData = await client.read(`File:${infoboxImage.value}`)
	if (imageData.missing || imageData.invalid) continue
	
	await move(`File:${infoboxImage.value}`, `File:${page}.png`, 'standardize naming')
	
	await client.edit(page, ({content}) => {
		return {
			text: content.replaceAll(`= ${infoboxImage.value}`, `= ${page}.png`),
			summary: 'standardize naming',
		}
	})
}