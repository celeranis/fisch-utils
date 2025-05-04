import { SEA_DISPLAY } from './Constants.js'
import { getFile } from './DataParser.js'
import { EnchantData, EnchantsLibrary } from './types/enchants.js'
import { Color } from './util/Color.js'

export type EnchantSourceType = 'EnchantRelic' | 'ExaltedRelic' | 'SongOfTheDeep'

export const EnchantsData = (await getFile<EnchantsLibrary>('enchants.json')).Enchants

export class Enchantment {
	name: string
	
	color: Color
	stroke_color: Color
	
	desc: string
	source_type: EnchantSourceType
	exclusive_seas?: string[]
	
	constructor(public data: EnchantData) {
		this.name = data.Display
		this.color = data.Color
		this.stroke_color = data.StrokeColor
		this.desc = data.Description
		
		this.source_type = data.IsSongOfTheDeep ? 'SongOfTheDeep'
			: data.IsExalted ? 'ExaltedRelic'
			: 'EnchantRelic'
			
		this.exclusive_seas = data.Worlds
			?.map(world => SEA_DISPLAY[world] ?? world)
	}
	
	static fromName(name: string) {
		const data = EnchantsData[name]
		if (!data) throw new TypeError(`Unknown Enchantment "${name}"`)
		
		return new this(data)
	}
	
	static getAll() {
		return Object.values(EnchantsData).map(data => new this(data))
	}
	
	getBoosts() {
		const boosts = {
			conditions: [],
			progress_speed: this.data.ProgressSpeedBoost ? this.data.ProgressSpeedBoost / 100 : undefined,
			lure: this.data.LureSpeedBonus,
			control: this.data.ControlIncrease,
			luck: this.data.LuckStatIncrease,
			mutation_chance: this.data.MutationStatIncrease,
			add_weight: this.data.WeightIncrease ? this.data.WeightIncrease / 100 : undefined,
		}
		
		switch (this.name) {
			case 'Abyssal':
				return { ...boosts, add_weight: 0.16 }
			case 'Blessed':
				return {
					...boosts,
					shiny_chance: this.data.StatIncrease,
					sparkling_chance: this.data.StatIncrease,
					lure: this.data.StatIncrease,
					progress_speed: this.data.StatIncrease
				}
			case 'Blessed Song':
			case 'Steady':
				return { ...boosts, progress_speed: this.data.StatIncrease / 100 }
			case 'Breezed':
				return {
					...boosts,
					luck: this.data.StatIncrease,
					lure: this.data.LureSpeedBonus,
					progress_speed: this.data.ProgressSpeedBoost,
					conditions: [
						{
							check: 'conditions',
							property: 'weather',
							values: ["Windy"]
						}
					],
				}
			case 'Chaotic':
			case 'Piercing':
				return {
					...boosts,
					stab: {
						trigger_rate: 0.15,
					},
					progress_speed: this.data.ProgressSpeedBoost
				}
			case 'Clever':
				return { ...boosts, xp_multiply: this.data.StatIncrease }
			case 'Controlled':
				return { ...boosts, control: this.data.StatIncrease }
			case 'Divine':
				return {
					...boosts,
					luck: this.data.StatIncrease,
					resilience: 20,
					lure: 20,
				}
			case 'Flashline':
				return {
					...boosts,
					progress_speed: (this.data.ProgressSpeedBoost! * 0.01 * 0.2) + (this.data.AltProgressSpeedBoost! * 0.01 * 0.8)
				}
			case 'Ghastly':
			case 'Quantum':
			case 'Scavenger':
			case 'Wormhole':
				return boosts
			case 'Hasty':
			case 'Swift':
				return {
					...boosts,
					 lure: this.data.StatIncrease,
					 progress_speed: this.data.ProgressSpeedBoost
				}
			case 'Herculean': 
				return {
					...boosts,
					strength: this.data.StatIncrease,
					control: this.data.ControlIncrease,
					progress_speed: this.data.ProgressSpeedBoost
				}
			case 'Unbreakable':
				return { 
					...boosts,
					strength: this.data.StatIncrease,
					control: this.data.ControlIncrease
				}
			case 'Immortal':
				return {
					...boosts,
					luck: this.data.StatIncrease,
					progress_speed: this.data.ProgressSpeedBoost
				}
			case 'Insight':
				return {
					...boosts,
					lure: 20,
					xp_multiply: this.data.StatIncrease,
				}
			case 'Long':
				return {
					...boosts,
					resilience: 20,
					progress_speed: this.data.ProgressSpeedBoost
				}
			case 'Invincible':
				return { ...boosts, strength: Number.MAX_SAFE_INTEGER }
			case 'Lucky':
				return {
					...boosts,
					luck: this.data.StatIncrease,
					lure: 15,
					mutation_chance: this.data.MutationStatIncrease
				}
			case 'Mutated':
				return { ...boosts, mutation_chance: this.data.StatIncrease }
			case 'Mystical':
				return {
					...boosts,
					luck: this.data.LuckStatIncrease,
					resilience: this.data.StatIncrease,
					lure: 15,
					progress_speed: this.data.ProgressSpeedBoost
				}
			case 'Quality':
				return {
					...boosts,
					luck: 15,
					lure: 15,
					resilience: 5,
					progress_speed: 5,
				}
			case 'Resilient':
				return {
					...boosts,
					resilience: this.data.StatIncrease
				}
			case 'Noir':
				return {
					...boosts,
					add_weight: (this.data.WeightIncrease ?? 0) / 100
				}
			case 'Sea King':
			case 'Sea Overlord':
				return {
					...boosts,
					add_weight: this.data.StatIncrease / 100
				}
			case 'Storming':
				return {
					...boosts,
					luck: this.data.StatIncrease,
					lure: this.data.LureSpeedBonus,
					conditions: [
						{
							check: 'conditions',
							property: 'weather',
							values: ["Rain"]
						}
					]
				}
			default:
				return undefined
		}
	}
}