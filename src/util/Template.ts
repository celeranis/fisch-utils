import { whitespace } from './General.js'

export interface TemplateMap {
	'FishInfobox': {
		image: string
		rarity: string
		sea: string
		location: string
		sublocation: string
		sources: string
		radar_location: string
		prog_speed: string
		xp: number
		weather: string
		time: string
		season: string
		bait: string
		base_weight: string
		base_value: string
		weight_range: string
	},
	'BaitInfobox': {
		name?: string
		image: string
		rarity: string
		event: string
		crates: string
		angler_quests: number | string
		pref_luck: number | string
		univ_luck: number | string
		resilience: number | string
		lure: number | string
		ability: string
	}
}

export class Template<N extends keyof TemplateMap, P extends TemplateMap[N]> {
	constructor(public name: N, public params: Partial<P> = {}) {}
	newlinesAfter: string[] = []

	addParam<K extends keyof P>(key: K, value: P[K]) {
		if (typeof value == 'boolean') {
			value = (value ? '1' : '') as P[K]
		}
		this.params[key] = value
		return this
	}

	removeParam(key: keyof P) {
		delete this.params[key]
		return this
	}

	getParam<K extends keyof P>(key: K): P[K] | undefined {
		return this.params[key]
	}

	addNewlineAfter(param: string) {
		this.newlinesAfter.push(param)
		return this
	}

	block(minTargetIndent: number = 0): string {
		const targetIndent = Math.max(minTargetIndent, ...Object.keys(this.params).map(key => key.length)) + 1
		const output = [
			`{{${this.name}`,
			...Object.entries(this.params).filter(([key, value]) => value !== undefined).map(([key, value]) =>
				(`|${whitespace(key, targetIndent)}=${String(value).match(/\n|(?:^(?:\*|:|#))/) ? `\n${value}` : ` ${value}`}`)
				+ (this.newlinesAfter.includes(key) ? '\n' : '')
			),
			'}}'
		]
		return output.join('\n')
	}

	inline(): string {
		return `{{${this.name}|${Object.entries(this.params).map(([key, value]) => Number(key) ? value : `${key}=${value}`).join('|')}}}`
	}

	static addParamValue(input: string, name: string, value: string | number) {
		const regex = new RegExp(`(\\|${name}\\s*=\\ *)[^\|}]*?\\n*(\\r?\\n?(?:\\||}}))`)
		if (regex.test(input)) {
			return input.replace(regex, `$1${value}$2`)
		} else {
			return null
		}
	}

	static getParamValue(input: string, name: string) {
		const regex = new RegExp(`\\|${name}\\s*=\\s*?(.*?)\\s*(?:\\||}})`)
		return input.match(regex)?.[1]?.trim()
	}

	static pageData(title: string, contentModel: string = 'wikitext', contentFormat: string = 'text/x-wiki'): string {
		return [
			`<%-- [PAGE_INFO]`,
			`    pageTitle = #${title}#`,
			`    contentModel = #${contentModel}#`,
			`    contentFormat = #${contentFormat}#`,
			`[END_PAGE_INFO] --%>`
		].join('\n')
	}
}