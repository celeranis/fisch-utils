import { readdirSync, readFileSync } from 'fs';
import { setTimeout } from 'timers/promises';
import { client } from '../util/Bot.js';

const fishFiles = readdirSync('./src/scripts/newfish', { withFileTypes: true })

async function attemptSave(title: string, content: string) {
	await client.save(title, content, 'version update (automatic)')
		.catch(async err => {
			console.warn(err)
			await setTimeout(20_000)
			await attemptSave(title, content)
		})
}

console.log('STARTING!!!!!!!!! in 10 scond')
await setTimeout(10_000)

for (const file of fishFiles) {
	const name = file.name.replace(/\.wikitext$/i, '')
	const pageContent = readFileSync(`${file.parentPath}/${file.name}`)
	await attemptSave(name, pageContent.toString())
}

await attemptSave('Module:Bestiary Order/data', readFileSync('./output/BestiaryOrder.lua').toString())
await attemptSave('Module:Fish Navbox/data', readFileSync('./output/NavboxData.lua').toString())

await attemptSave('Module:Item/fish', readFileSync('./output/RarityData.lua').toString())
await attemptSave('Module:Item/bobbers', readFileSync('./output/BobberData.lua').toString())
await attemptSave('Module:Item/bait', readFileSync('./output/BaitData.lua').toString())

await attemptSave('Template:Item/styles.css', readFileSync('./output/rodstyles.css').toString())
await attemptSave('Template:Mutation/styles.css', readFileSync('./output/mutations.css').toString())
await attemptSave('Template:PlayerTitle/styles.css', readFileSync('./output/titles.css').toString())

await attemptSave('MediaWiki:FischTools-Data.json', readFileSync('./output/CalcData.json').toString())