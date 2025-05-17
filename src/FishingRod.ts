import { DEV_OVERRIDES } from './Constants.js'
import { getFile } from './DataParser.js'
import { RodData, RodsLibrary } from './types/Rods.js'
import { Color } from './util/Color.js'

export const rods: RodsLibrary = await getFile('rods.json')

export const RodPassiveData: Record<string, RodPassiveEffects> = {
	"Krampus's Rod": {
		states: ['Lure', 'Luck', 'Both'],
		stats: [
			{
				lure: 50,
				conditions: [
					{
						check: "conditions",
						property: 'passiveState',
						values: ['Lure']
					}
				]
			},
			{
				luck: 25,
				conditions: [
					{
						check: "conditions",
						property: 'passiveState',
						values: ['Luck']
					}
				]
			},
			{
				lure: 50,
				luck: 25,
				conditions: [
					{
						check: "conditions",
						property: 'passiveState',
						values: ['Both']
					}
				]
			}
		]
	},
	'Riptide Rod': {
		states: ['Active'],
		stats: {
			luck: 30,
			lure: 25,
			conditions: [
				{
					check: "conditions",
					property: 'passiveState',
					values: ['Active']
				}
			]
		}
	},
	'Sovereign Doombringer': {
		progress_boost: {
			trigger_delay: 2,
			boost_percent: 30,
			max_boost: 99,
		}
	},
	'Voyager Rod': {
		progress_boost: {
			trigger_delay: 2,
			boost_percent: 20,
			boost_time: 3,
			max_boost: 60,
		}
	},
	'No-Life Rod': {
		stab: {
			trigger_rate: 0.25,
			boost_percent: 2,
		}
	},
	'Tempest Rod': {
		stats: {
			progress_speed: 0.15,
		}
	},
	'Wisdom Rod': {
		states: ['1 Perfect Streak', '4 Perfect Streak', '8 Perfect Streak', '12 Perfect Streak', '16 Perfect Streak'],
		stats: [
			{
				xp_multiply: 1 + (0.05 * 1),
				conditions: [
					{
						check: "conditions",
						property: 'passiveState',
						values: ['1 Perfect Streak']
					}
				]
			},
			{
				xp_multiply: 1 + (0.05 * 4),
				conditions: [
					{
						check: "conditions",
						property: 'passiveState',
						values: ['4 Perfect Streak']
					}
				]
			},
			{
				xp_multiply: 1 + (0.05 * 8),
				conditions: [
					{
						check: "conditions",
						property: 'passiveState',
						values: ['8 Perfect Streak']
					}
				]
			},
			{
				xp_multiply: 1 + (0.05 * 12),
				conditions: [
					{
						check: "conditions",
						property: 'passiveState',
						values: ['12 Perfect Streak']
					}
				]
			},
			{
				xp_multiply: 1 + (0.05 * 16),
				conditions: [
					{
						check: "conditions",
						property: 'passiveState',
						values: ['16 Perfect Streak']
					}
				]
			},
		]
	},
	'Kings Rod': {
		stats: {
			add_weight: 0.3
		}
	},
	'Rod Of The Eternal King': {
		states: ['Active'],
		stats: {
			luck: 150,
			conditions: [
				{
					check: 'conditions',
					property: 'passiveState',
					values: ['Active']
				}
			]
		}
	},
	// 'Rod Of The Forgotten Fang': {
	// 	additional_fish: {
	// 		trigger_rate: 1 / 3,
	// 		selection_mode: 'higher_or_same',
	// 		size_multiplier: 1.175
	// 	}
	// },
	'Buddy Bond Rod': {
		states: ['Active'],
		stats: {
			add_weight: 0.3,
			conditions: [
				{
					check: 'conditions',
					property: 'passiveState',
					values: ['Active']
				}
			]
		}
	},
	'Destiny Rod': {
		stats: {
			shiny_chance: 10,
			sparkling_chance: 10,
		}
	},
	'Seraphic Rod': {
		progress_boost: {
			trigger_delay: 2,
			boost_percent: 40,
			boost_time: 3,
			max_boost: 60,
		}
	},
	'Trident Rod': {
		stab: {
			trigger_rate: 0.25,
			boost_percent: 6,
		}
	},
	'Celestial Rod': {
		states: ['Active'],
		stats: {
			luck: 80,
			lure: 20,
			xp_multiply: 1.3,
			conditions: [
				{
					check: 'conditions',
					property: 'passiveState',
					values: ['Active']
				}
			]
		}
	},
	'Free Spirit Rod': {
		stab: {
			trigger_rate: 0.25,
			boost_percent: 6,
		}
	},
	'Azure Of Lagoon': {
		stab: {
			trigger_rate: 0.25,
			boost_percent: 6,
		}
	},
	"Leviathan's Fang Rod": {
		stab: {
			trigger_rate: 0.25,
			boost_percent: 6,
		}
	},
	"Frog Rod": {
		states: ['1 Frog Active', '2 Frogs Active', '3 Frogs Active'],
		stats: [
			{
				luck_multiply: 0.5,
				conditions: [{
					check: 'conditions',
					property: 'passiveState',
					values: ['1 Frog Active']
				}]
			},
			{
				luck_multiply: 1,
				conditions: [{
					check: 'conditions',
					property: 'passiveState',
					values: ['2 Frogs Active']
				}]
			},
			{
				luck_multiply: 1.5,
				conditions: [{
					check: 'conditions',
					property: 'passiveState',
					values: ['3 Frogs Active']
				}]
			},
		]
	},
	'Zeus Rod': {
		states: ['Active']
	},
	'Verdant Shear Rod': {
		states: ['Active']
	},
	"Blazebringer Rod": {
		states: ['Stage 2', 'Stage 3'],
		stats: [
			{
				luck_multiply: 0.1,
				conditions: [{
					check: 'conditions',
					property: 'passiveState',
					values: ['Stage 2']
				}]
			},
			{
				luck_multiply: 0.25,
				conditions: [{
					check: 'conditions',
					property: 'passiveState',
					values: ['Stage 3']
				}]
			}
		]
	},
	'Summit Rod': {
		stats: {
			progress_speed: 0.1
		}
	},
	'Abyssal Specter Rod': {
		stats: {
			add_weight: 0.2
		}
	},
	'Tryhard Rod': {
		stats: {
			progress_speed: 0.95,
		}
	},
	'Rod Of Time': {
		stats: {
			xp_multiply: 1.25
		}
	},
	'Fang of the Eclipse': {
		stats: {
			luck: 150,
			lure: 99,
			progress_speed: 0.5,			
			resilience: -50,
			strength: Number.MAX_SAFE_INTEGER,
			add_weight: 0.2,
			conditions: [{
				check: 'conditions',
				property: 'weather',
				values: ['Eclipse']
			}]
		}
	},
	'Astralhook Rod': {
		states: ['Active'],
		stats: {
			progress_speed: 0.15
		}
	},
	'Great Rod of Oscar': {
		stats: {
			progress_speed: 0.3,
			xp_multiply: 1.25
		}
	},
	'Carrot Rod': {
		states: ['Active']
	},
	'Treasure Rod': {
		stats: {
			progress_speed: 0.05
		}
	}
}

export class FishingRod {
	Price!: number | null
	
	Luck!: number
	Strength!: number | null
	LureSpeed!: number
	Resilience!: number
	Control!: number
	LineDistance!: number
	Passive?: string
	
	Color!: Color
	BobberTop!: Color
	BobberBottom!: Color
	ProgressEfficiency?: number
	
	Description?: string
	
	DEV?: boolean
	Unpurchasable?: boolean
	Unregistered?: boolean
	Worlds?: string[]
	
	constructor(data: RodData, public Name: string) {
		Object.assign(this, data)
		this.Worlds = data.Worlds?.filter(Boolean) ?? []
		if (Name in DEV_OVERRIDES) {
			this.DEV = DEV_OVERRIDES[Name]
		}
	}
	
	static getAll() {
		return Object.entries(rods)
			.map(([name, data]) => new FishingRod(data, name))
	}
	
	static getNonDev() {
		return Object.entries(rods)
			.map(([name, data]) => new FishingRod(data, name))
			.filter(rod => !rod.DEV)
	}
	
	static fromName(name: string) {
		return new FishingRod(rods[name], name)
	}
	
	getPassiveData(): RodPassiveEffects | undefined {
		let baseData = RodPassiveData[this.Name]
		if (this.ProgressEfficiency) {
			baseData ??= {}
			baseData.stats ??= {}
			let statsPassive = Array.isArray(baseData.stats) ? baseData.stats[0] : baseData.stats
			statsPassive.progress_speed = this.ProgressEfficiency
		}
		return baseData
	}
}

export interface MutationCondition {
	check: 'fish' | 'conditions'
	property: string
	op?: 'any' | 'not' | 'contains_any' | 'contains_none'
	values: (string | boolean | number)[]
}

export interface StatBoosts {
	add_weight?: number
	luck?: number
	lure?: number
	mutation_chance?: number
	progress_speed?: number
	resilience?: number
	shiny_chance?: number
	sparkling_chance?: number
	strength?: number
	xp_multiply?: number
	luck_multiply?: number
}

export interface BaseRodPassive {
	trigger_rate?: number
	conditions?: MutationCondition[]
}

export interface RodPassive_ProgressBoost extends BaseRodPassive {
	trigger_at?: number
	trigger_delay?: number
	boost_percent: number
	boost_time?: number
	max_boost?: number
}

export interface RodPassive_Stab extends BaseRodPassive {
	boost_percent?: number
}

// export interface RodPassive_AdditionalFish extends BaseRodPassive {
// 	mutation?: string
// 	size_multiplier?: number
// 	selection_mode: 'random' | 'same' | 'higher_or_same'
// }

export interface RodPassive_StatBoost extends StatBoosts, BaseRodPassive {}

export interface RodPassiveEffects {
	states?: string[]
	// additional_fish?: RodPassive_AdditionalFish
	stab?: RodPassive_Stab
	progress_boost?: RodPassive_ProgressBoost
	stats?: RodPassive_StatBoost | RodPassive_StatBoost[]
}