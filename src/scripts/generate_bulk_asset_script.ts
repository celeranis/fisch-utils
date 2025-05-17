// This script generates a browser script output/download_assets.js
// for the given data filenames.

// Usage: node src/scripts/generate_bulk_asset_script filename.json
// Example: node src/scripts/generate_bulk_asset_script RodSkins.json

import { writeFile } from 'node:fs/promises'
import { getFile } from '../DataParser.js'

const downloadAsset = `
async function downloadAsset(id, name) {
	// remove rbxassetid prefix and any extra whitespace
	id = id
		.replace(/^rbxassetid:\\\/\\\//i, '')
		.trim()
	
	// fetch asset data
	const assetInfoResponse = await fetch(\`https://assetdelivery.roblox.com/v2/asset?id=$\{id}\`, { credentials: 'include' })
	const assetInfoBody = await assetInfoResponse.json()
	
	// something went wrong
	if (!assetInfoResponse.ok) {
		console.error(\`Failed to download asset "$\{name}" ($\{id}):\`, assetInfoBody)
		
		if (assetInfoResponse.status == 429 || assetInfoResponse.status == 401) {
			console.log('Waiting to retry...')
			setTimeout(() => downloadAsset(id, name), (Number(assetInfoResponse.headers.get('x-retry-after')) || 20) * 1000)
		}
	} else {
		const locations = assetInfoBody.locations
		for (const [i, location] of locations.entries()) {
			// fetch the asset itself
			const fileData = await fetch(location.location)
			const fileBlob = await fileData.blob()
			
			// download the asset with an appropriate name
			const a = document.createElement("a")
			a.href = URL.createObjectURL(fileBlob)
			a.download = \`$\{name}$\{i != 0 ? \`-$\{i}\` : ''}.png\`
			a.click()
		}
	}
}
`.trim()

const targetFilenames = process.argv.filter(arg => arg.endsWith('.json'))
	.map(file => file.split(','))
	.flat(1)

if (targetFilenames.length == 0) {
	throw new TypeError('Please specify one or more JSON filenames from which to read.')
}

const included = new Set<string>()
const output = [
	'// This script should be run in the browser console on roblox.com while logged in.',
	downloadAsset,
]

function recurseData(obj: string | object | number | boolean, lastName?: string) {
	if (typeof obj == 'string') {
		obj = obj.trim()
		if (obj.startsWith('rbxassetid://')) {
			obj = obj.replace('rbxassetid://', '').trim()
			if (!obj || included.has(obj)) return
			
			output.push(`await downloadAsset('${obj}', \`${lastName || `unknown${obj}`}\`)`)
			included.add(obj)
		}
	} else if (typeof obj == 'object') {
		if ('Name' in obj && typeof obj.Name == 'string') lastName = obj.Name
		if ('name' in obj && typeof obj.name == 'string') lastName = obj.name
		
		for (const [key, value] of Object.entries(obj)) {
			let nextName = lastName
			if (key.toLowerCase() != 'icon' && key.toLowerCase() != 'image' && !Array.isArray(obj)) nextName = key
			
			recurseData(value, nextName)
		}
	}
}

for (const filename of targetFilenames) {
	const targetData = await getFile(filename)
	output.push(
		'',
		`// ${filename}`
	)
	recurseData(targetData as object)
}

await writeFile('./output/download_assets.js', output.join('\n'))