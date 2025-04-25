import { setTimeout } from 'timers/promises';
import { client } from '../util/Bot.js';
// import { roundTo } from '../util/General.js';

const fishPages = await client.getPagesInCategory('NPCs')
const CAT_NAME = 'NPC Images'
const INFOBOX_NAME = 'NPCInfoBox'

async function addCat(fileName: string) {
	const pageData = await client.read('File:' + fileName)
	let content = pageData?.revisions?.[0]?.content
	
	if (content?.includes(`[[Category:${CAT_NAME}]]`) || content?.includes(`[[Category: ${CAT_NAME}]]`)) return
	
	content += `\n[[Category:${CAT_NAME}]]`
	
	await client.save('File:' + fileName, content!, 'adding category').catch(async err => {
		if (err?.code == 'ratelimited') {
			console.log('ratelimited, waiting 10s')
			await setTimeout(10_000)
			await addCat(fileName)
		} else throw err
	})
}

async function updatePage(page: string) {
	// const fish = fishData.find(fish => fish.Name == page)
	// if (!fish) throw new Error(`wtf is a ${page}`)
	
	const pageData = await client.read(page)

	const wikitext = new client.Wikitext(pageData?.revisions?.[0]?.content!)
	const infobox = wikitext.parseTemplates({ namePredicate: (name) => name == INFOBOX_NAME })[0]
	
	if (!infobox) {
		console.warn(`No infobox on page ${page}`)
		return
	}
	
	const infoboxImage = infobox.getParam('image')
	const shinyImage = infobox.getParam('image_shiny')
	
	if (infoboxImage?.value?.trim()) {
		await addCat(infoboxImage.value.trim())
	}
	
	if (shinyImage?.value?.trim()) {
		await addCat(shinyImage.value.trim())
	}
}

for (const page of fishPages) {
	if (page.startsWith('Category:')) continue
	
	await updatePage(page)
}