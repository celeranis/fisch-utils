import { existsSync, readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { Color, ColorSequence, JSONColor, JSONColorSequence } from './util/Color.js';
import { JSONVector, Vector } from './util/Vector.js';

export function processValue(value: string) {
	if (value == 'true' || value == 'false') {
		return value == 'true'
	} else if (Number.isFinite(Number.parseFloat(value))) {
		return Number.parseFloat(value)
	} else if (value == '') {
		return []
	} else {
		return value
	}
}

export function parseData(path: string, orderedPath?: string): any[] {
	const orderedData = orderedPath ? parseData(orderedPath) : undefined
	const file = readFileSync(`./data/${path}`).toString()
	const data: any[] = []
	let currentFish: any = undefined
	let currentArray: any[] | undefined = undefined
	for (const line of file.split('\n')) {
		if (line.startsWith('    ')) {
			let value = processValue(line.replace(/\s+\d+:\s+/, ''))
			currentArray?.push(value)
		} else if (line.startsWith('  ')) {
			let [, key, value] = line.match(/^\s+(.+?):\s*(.*)$/) ?? []
			const pvalue = processValue(value)
			currentFish![key] = pvalue
			if (Array.isArray(pvalue)) currentArray = pvalue
		} else {
			const name = line.match(/^(.+):\s*$/)?.[1]
			if (!name) continue
			const ordered = orderedData?.find(f => f.Name == name)
			currentFish = { Name: name, Index: ordered?.Index ?? data.length }
			if (name != 'RarityColours') {
				data.push(currentFish)
			}
		}
	}
	
	if (orderedData) {
		data.sort((f0, f1) => f0.Index - f1.Index)
	}
	
	return data
}

export function parseLua(raw: string) {
	const jsonify = raw.replace(/^.*return \{/s, '{')
		.replaceAll(/ = /g, ': ')
		.replaceAll(/\{(\s+['"].+?)\}/gs, '[$1]')
		.replaceAll(': nil,', ': null,')
		.replaceAll(/([\d\.]+)\/([\d\.]+)/g, (_, a, b) => JSON.stringify(Number(a) / Number(b)))
		.replaceAll("\\'", '<$<AST>$>')
		.replaceAll(/'([^'\n]*)'/g, (_, str) => `"${str.replaceAll('<$<AST>$>', "'").replaceAll('"', '\\"')}"`)
		.replaceAll(/\[(".+")\]/g, '$1')
		.replaceAll(/([\{,]\s*)(\w+): /g, '$1"$2": ')
		.replaceAll(/,(\s*[\}\]])/g, '$1')
		.replaceAll(/DateTime.fromUniversalTime\((.+?)\)/gi, (_, args) => `[${args}]`)
		.replace(/};?\s+$/, '}')
	
	return JSON.parse(jsonify)
}

export function loadLua(path: string) {
	return parseLua(readFileSync(path).toString())
}

export function preprocessJSON(obj: unknown) {
	if (typeof (obj) == 'object' && obj) {
		if ('$type' in obj) {
			switch (obj.$type) {
				case 'Color3':
					return Color.fromJSON(obj as JSONColor)
				case 'Vector3':
					return Vector.fromJSON(obj as JSONVector)
				case 'DateTime':
					return new Date((obj as any).timestamp)
				case 'Font':
					return obj
				case 'ColorSequence':
					return ColorSequence.fromJSON(obj as JSONColorSequence)
				default:
					throw new TypeError(`Unknown $type "${obj.$type}"`)
			}
		}
		
		if (Array.isArray(obj)) {
			return obj.map(v => preprocessJSON(v))
		} else {
			for (const [k, v] of Object.entries(obj)) {
				obj[k] = preprocessJSON(v)
			}
		}
	}
	
	return obj
}

export async function getFile<T>(path: string): Promise<T> {
	if (process.argv.includes('--balancing') && existsSync(`./data/balancing/${path}`)) {
		path = `balancing/${path}`
	}
	
	const json = JSON.parse((await readFile(`./data/${path}`)).toString())
	
	const processed = preprocessJSON(json) as T
	return processed
}