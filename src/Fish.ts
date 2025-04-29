import { Bait } from './Bait.js';
import { AVOID_RODS, DISPLAY_LOCATIONS, HARDCODED_PENALTIES, IGNORE_ZONES, LIMITED_BAIT, LIMITED_POOLS, RECOMMENDED_RODS, UNFISHABLE_ZONES, ZONE_ABUNDANCE_MAP, ZONE_DISPLAY } from './Constants.js';
import { getFile } from './DataParser.js';
import { FishingRod } from './FishingRod.js';
import { CrabZonesLibrary } from './types/crabzone.js';
import { FishData, FishLibrary } from './types/Fish.js';
import { LocationsLibrary } from './types/Locations.js';
import { Rarity } from './types/Shared.js';
import { ZonesLibrary } from './types/zones.js';
import { roundTo } from './util/General.js';

let baits: Bait[]
export const ZoneData: ZonesLibrary = await getFile('zones.json')
export const crabZoneData: CrabZonesLibrary = await getFile('crabzone.json')
export const locationData: LocationsLibrary = await getFile('locations.json')

ZoneData['Whale Migration/Moby'] = {
	...ZoneData['Whales Pool'],
	Pool: [
		...ZoneData['Whales Pool'].Pool,
		'Moby'
	],
	CantBeWhormholed: true
}

const crabCageSet = new Set<string>()
Object.values(crabZoneData).forEach(cz => cz.Pool.forEach(p => crabCageSet.add(p)))

const TIME_PENALTY = 0.1
const SEASON_FACTOR = 0.25
const SEASON_PENALTY = 0.15
const WEATHER_FACTOR = 0.35

const LUCK_FAVORING_RARITIES = ['Legendary', 'Mythical', 'Exotic', 'Secret']
const LUCK_UNFAVORING_RARITIES = ['Trash', 'Common']

const LUCK_200_UNFAVORING_RARITIES = ['Trash', 'Common', 'Uncommon']
const LUCK_200_UNFAVORING_PENALTY = 0.1

export const fishData: FishLibrary = await getFile('fish.json')

const RARITY_INDEX = Object.fromEntries((fishData.Rarities as unknown as string[]).map((rarity, index) => [rarity, index]))

export interface Conditions {
	luck: number
	sluck?: number
	bait?: string
	season?: string
	weather?: string
	time?: string
	zone: string
	max_weight?: number
	rod?: string
	world: string
	rod_worlds: string[]
	
	abundance_for?: string
	abundance_chance?: number

	ab?: boolean
	notff?: boolean
	miniluck?: boolean
	merlinLuck?: boolean
}

export function getLure(conditions: Conditions, rod: FishingRod) {
	let rodLure = 100 - (rod?.LureSpeed ?? 100)
	if (conditions.world && !rod?.Worlds?.includes(conditions.world)) {
		rodLure = Math.min(Math.max(rodLure - 90, 1), 99)
	}

	return rodLure
		+ ((baits.find(bait => bait.name == conditions.bait)?.lure_speed ?? 0) * (conditions.rod == 'Resourceful Rod' ? 2 : 1))
}

export function getResilience(fish: Fish, conditions: Conditions, rod: FishingRod) {
	let rodResil = rod?.Resilience ?? 0
	if (conditions.world && !rod?.Worlds?.includes(conditions.world)) {
		rodResil = Math.round(rodResil * 0.5)
	}

	return (fish?.Resilience ?? 0)
		+ rodResil
		+ ((baits.find(bait => bait.name == conditions.bait)?.resilience ?? 0) * (conditions.rod == 'Resourceful Rod' ? 2 : 1))
}

export function getProgressSpeed(fish: Fish, conditions: Conditions, rod: FishingRod) {
	let speed = fish.ProgressSpeed ?? 0

	if (fish.Name != 'Scylla' || conditions.rod == "Leviathan's Fang Rod") {
		let rodPassives = rod.getPassiveData()
		speed += (Array.isArray(rodPassives?.stats) ? rodPassives?.stats?.[0]?.progress_speed : rodPassives?.stats?.progress_speed) ?? 0
	}

	return speed
}

export function getConditionScore(conditions: Conditions, fish: Fish, chance: number) {
	if (chance <= 0) return 0
	
	let rod = FishingRod.fromName(conditions.rod!)
	let lure = Math.min(getLure(conditions, rod), 100) // max lure of 100
	let resilience = Math.max(Math.min(getResilience(fish, conditions, rod), 150), 20) // resilience makes no difference below 20 and very little difference above 150
	let control = rod.Control ?? 0
	let passives = rod.getPassiveData()

	// default difficulty factor, scaling with progress speed, resilience, and control
	let difficultyFactor = (150 / resilience) * (1 / (1 + getProgressSpeed(fish, conditions, rod))) * (0.9 - (control + 0.3))

	// if the rod has a stab passive (i.e. trident, NLR)
	// reduce the difficulty factor proportionally with the expected stab rate
	if (passives?.stab) {
		difficultyFactor -= ((1 / (resilience * 0.00215)) * (passives.stab.trigger_rate ?? 0.25) * (passives.stab.boost_percent ?? 6)) * 0.5
	}

	// if the rod has a progress boost (i.e. seraphic, voyager, SD)
	// reduce the difficulty factor proportionally with the boost provided
	if (passives?.progress_boost) {
		difficultyFactor *= (1 - (passives.progress_boost.boost_percent / 100))
	}

	let finalScore = chance * ((0.5 + (lure / 200)))

	finalScore -= (finalScore * difficultyFactor * 0.05)
	finalScore *= 10000

	return finalScore
}

export class Fish {
	FavouriteTime?: string
	FavouriteBait?: string
	SparkleColor?: string
	Hint?: string
	Description?: string
	Chance?: number
	Weather?: string[]
	XP?: number
	HoldAnimation?: string
	Seasons?: string[]
	Rarity!: Rarity
	WeightPool: [number, number]
	From?: string
	FromLimited?: string
	Quips?: string[]
	Price: number
	Resilience?: number
	HideInBestiary?: boolean
	IsLimitedBestiary?: boolean
	
	BaitContents?: string[]
	FishContents?: string[]
	CoinContents?: [number, number]
	IsCrate?: boolean
	CrateType?: string
	ProgressEfficiency?: number
	
	HideFishModel?: boolean
	BlockPassiveCapture?: boolean
	IsPearl?: boolean
	Worlds: string[]
	_no_defined_worlds: boolean
	
	CustomProgressEfficiency?: { Value: number, Rod?: string }[]
	
	constructor(data: FishData, public Name: string, public Index: number) {
		Object.assign(this, data)
		this.WeightPool ??= [0, 0]
		this.Price ??= 0
		// @ts-ignore: assigned with Object.assign
		this._no_defined_worlds = !this.Worlds
		this.Worlds ??= ['Sea 1']
		
		if (this.From && locationData[this.From] && !DISPLAY_LOCATIONS[this.From]) {
			this.From = locationData[this.From].Name
		}

		if (this.FromLimited && locationData[this.FromLimited]) {
			this.FromLimited = locationData[this.FromLimited].Name
		}
		
		if (Name == 'Moby') {
			this.Chance = 0
		}
		// this.Description &&= fixUtf8(this.Description)
		// this.Hint &&= fixUtf8(this.Hint)
	}
	
	getAvgWeight() {
		return (this.WeightPool[0] + ((this.WeightPool[1] - this.WeightPool[0]) / 2)) / 10
		// return this.WeightPool[1] / 10
	}
	
	getPricePerKg() {
		return this.Price / (this.WeightPool[1] / 10)
	}
	
	getAvgPrice() {
		return this.getPricePerKg() * this.getAvgWeight()
		// return this.Price
	}
	
	getRange() {
		return (this.WeightPool[1] - this.WeightPool[0]) / 10
	}
	
	getRarityIndex() {
		return RARITY_INDEX[this.Rarity]
	}
	
	getSortIndex() {
		return (this.getRarityIndex() * 10000) + this.Index
	}
	
	getContents() {
		const contents = new Set<string>()
		if (this.BaitContents) {
			this.BaitContents.forEach(bait => contents.add(bait + ' (Bait)'))
		}
		if (this.FishContents) {
			this.FishContents.forEach(fish => contents.add(fish))
		}
		if (this.CoinContents) {
			contents.add(`${this.CoinContents[0]}–${this.CoinContents[1]} C$`)
		}
		return contents
	}
	
	isCageFish() {
		const lowerHint = this.Hint?.toLowerCase()
		return lowerHint?.includes('crab cage') || lowerHint?.includes('cage fish')
	}
	
	getZones(noDisplay: boolean = false) {
		return Object.entries(ZoneData)
			.filter(([zone, { Pool }]) => Pool.includes(this.Name) && !IGNORE_ZONES.includes(zone) && !UNFISHABLE_ZONES.includes(zone))
			.map(([zone]) => !noDisplay ? (ZONE_DISPLAY[zone] ?? zone) : zone)
			.sort()
	}
	
	isMeteorItem() {
		const lowerHint = this.Hint?.toLowerCase()
		return lowerHint?.includes('meteor')
	}

	isClamDrop() {
		const lowerHint = this.Hint?.toLowerCase()
		return lowerHint?.includes('clam')
	}
	
	getSources(otherFish: Fish[]): string[] {
		const sources: string[] = []
		if (this.isCageFish()) {
			sources.push('Crab Cage')
		} else if (this.isMeteorItem()) {
			sources.push('Meteor')
		} else if (this.isClamDrop()) {
			sources.push('Clam')
		} else {
			sources.push('Fishing Rod')
			if (crabCageSet.has(this.Name)) {
				sources.push('Crab Cage')
			}
		}
		for (const fish of otherFish) {
			if (fish?.FishContents?.includes(this.Name)) {
				sources.push(fish.Name)
			}
		}
		return sources
	}
	
	getInfoboxLocation(): string | undefined {
		return DISPLAY_LOCATIONS[this.From!] ?? (this.From != 'None' ? this.From : undefined)
	}
	
	getInfoboxSublocation(): string | undefined {
		const lowerHint = this.Hint?.toLowerCase()
		return (lowerHint?.includes('shark hunt') && 'Shark Hunt')
			|| ((lowerHint?.includes('freshwater') || lowerHint?.includes('fresh water') || lowerHint?.includes('pond') || lowerHint?.includes('lake')) && 'Freshwater')
			|| ((lowerHint?.includes('saltwater') || lowerHint?.includes('salt water')) && 'Saltwater')
			|| (lowerHint?.includes('reef') && 'Coral Reef')
			|| ''
	}
	
	get ProgressSpeed(): number {
		let cpe = this.CustomProgressEfficiency?.find(cpe => !cpe.Rod)?.Value
		if (cpe) {
			return cpe + 1
		}
		return Math.round(((this.ProgressEfficiency ?? 1) - 1) * 100) / 100
	}
	
	static loaded: boolean = false
	static map: Record<string, Fish> = {}
	
	static loadAll() {
		baits = Bait.loadAll()
		const fish: Fish[] = []
		for (const [i, [name, data]] of Object.entries(fishData).entries()) {
			const currentFish = new Fish(data, name, i)
			fish.push(currentFish)
			this.map[name] = currentFish
		}
		this.loaded = true
		return fish
	}
	
	static fromName(name: string): Fish | undefined {
		return this.loaded ? this.map[name] : this.loadAll().find(f => f.Name == name)
	}
	
	static getCrates(): Fish[] {
		const allFish = this.loaded ? Object.values(this.map) : this.loadAll()
		return allFish.filter(fish => fish.IsCrate)
	}
	
	getFishingChance(conditions: Conditions) {
		const statMultiplier = conditions.rod_worlds.includes(conditions.world) ? 1 : 0.5
		
		if (Number.isFinite(conditions.max_weight) && (this.WeightPool[0] / 10) > Math.round(conditions.max_weight! * statMultiplier)) {
			return 0
		}
		
		if (ZONE_ABUNDANCE_MAP[conditions.zone]) {
			conditions.abundance_for = ZONE_ABUNDANCE_MAP[conditions.zone].abundance_for
			conditions.abundance_chance = ZONE_ABUNDANCE_MAP[conditions.zone].abundance_chance
		}
		
		let chance = this.Chance!
		let baseChance = chance
		let maxChanceIncrease = 0
		const bait = baits.find(bait => bait.name == conditions.bait)
		
		let baitLuck = (((conditions.bait && conditions.bait != 'None') ? (this.FavouriteBait == conditions.bait ? bait?.preferred_luck : bait?.universal_luck) : 0) ?? 0)
		if (conditions.rod == 'Resourceful Rod') {
			baitLuck *= 2
		}
		
		let currentLuck = 
			(conditions.luck * statMultiplier)
			+ baitLuck
			+ (conditions.merlinLuck ? 30 : 0) // luck bonus
			
		const serverLuck = conditions.sluck ?? 0
		
		if (currentLuck > 0) {
			currentLuck = Math.log(currentLuck / baseChance)
		} else if (currentLuck < 0) {
			currentLuck = -Math.log(-currentLuck / baseChance)
		}
	
		if (conditions.season) {
			if (this.Seasons?.includes(conditions.season)) {
				chance += baseChance * SEASON_FACTOR
				if (conditions.rod == 'Seasons Rod') {
					chance *= 1.2
				}
			} else {
				chance -= baseChance * SEASON_PENALTY
			}
		}
	
		if (conditions.weather && this.Weather?.includes(conditions.weather)) {
			chance += baseChance * WEATHER_FACTOR
		}
		
		if (conditions.abundance_for == this.Name) {
			if (conditions.abundance_chance != undefined) {
				chance += conditions.abundance_chance
				maxChanceIncrease += conditions.abundance_chance
			} else {
				chance *= 1.7
			}
		}
		
		if (conditions.rod == 'Magnet Rod' && this.IsCrate) {
			chance += 10000
			maxChanceIncrease += 10000
		}
		
		if (conditions.time && this.FavouriteTime && this.FavouriteTime != 'None') {
			if (conditions.time != this.FavouriteTime && conditions.rod != 'Nocturnal Rod') {
				chance *= TIME_PENALTY
			}
			
			if (this.FavouriteTime == 'Night' && conditions.notff) {
				chance *= 2
			}
		}
		
		if (currentLuck > 0) {
			const conditionLuck = (conditions.ab || conditions.weather == 'Aurora Borealis') ? 7 : 1
			if (LUCK_UNFAVORING_RARITIES.includes(this.Rarity) || (!LUCK_FAVORING_RARITIES.includes(this.Rarity) && baseChance > 40)) {
				chance -= currentLuck * Math.max(conditionLuck + serverLuck, 1) * 20
			} else {
				chance += currentLuck * Math.max(conditionLuck + serverLuck, 1)
			}
		}
		
		if (HARDCODED_PENALTIES[this.Name]) {
			chance /= HARDCODED_PENALTIES[this.Name]
		}
		
		if (this.Rarity == 'Secret') {
			chance /= 25
		}
		
		if ((conditions.zone?.includes('Ancient Isle') || conditions.zone?.includes('Megalodon')) && this.Rarity == 'Legendary') {
			chance *= 1.5
		}
		
		if (currentLuck >= 200 && LUCK_200_UNFAVORING_RARITIES.includes(this.Rarity)) {
			chance *= LUCK_200_UNFAVORING_PENALTY
		}
		
		chance = Math.min(Math.max(chance, 0), 200 + maxChanceIncrease)
		
		return chance
	}
	
	getPercentChanceWithCondition(conditions: Conditions) {
		let alreadyAdded = new Set<string>()
		const zonePool = ZoneData[conditions.zone].Pool
			?.map(fish => Fish.fromName(fish))
			?.filter(v => v != undefined && (alreadyAdded.has(v.Name) ? false : alreadyAdded.add(v.Name))) as Fish[]
		
		let totalChance = 0
		zonePool
			?.forEach(fish => totalChance += fish.getFishingChance(conditions))
		
		// cursed in-game implementations call for cursed wiki ones
		if (conditions.zone == 'Whale Migration/Moby') {
			if (this.Name == 'Moby') {
				return (Fish.fromName('Blue Whale')!.getFishingChance(conditions) / totalChance) * 0.15
			} else if (this.Name == 'Blue Whale') {
				return (this.getFishingChance(conditions) / totalChance) * 0.85
			}
		}
		
		return this.getFishingChance(conditions) / totalChance
	}
	
	getBestRods(overrides?: Partial<Conditions>): { normal: Record<string, [number, number]>, aurora: Record<string, [number, number]> } {
		/** @type {Record<string, [number, number]>} */
		const rodsNormal = {}
		/** @type {Record<string, [number, number]>} */
		const rodsAurora = {}
		
		for (const zone of this.getZones(true)) {
			for (const time of overrides?.time ? [overrides.time] : ['Day', 'Night']) {
				// if (zone == 'Megalodon Ancient' && time == 'Night') continue
				if (LIMITED_POOLS[zone] && ((this.FromLimited != LIMITED_POOLS[zone] && this.From != LIMITED_POOLS[zone]) && (!this.Name.includes('Algae') && !zone.includes(' Algae Pool')))) continue
				for (let weather of overrides?.weather ? [overrides.weather] : ['NULL', /*'Clear', 'Foggy', 'Rain', 'Windy',*/ 'Aurora Borealis']) {
					if (weather == 'Aurora Borealis' && time != 'Night') continue
					for (const season of overrides?.season ? [overrides.season] : [/*'Spring', 'Summer', 'Autumn', 'Winter'*/'NULL']) {
						for (const bait of overrides?.bait ? [overrides.bait] : baits.map(bait => bait.name)) {
							
							if (LIMITED_BAIT[bait] && this.FavouriteBait != bait) {
								continue
							}
							
							for (const rod of overrides?.rod ? [FishingRod.fromName(overrides.rod)] : FishingRod.getAll()) {
								if (rod.DEV || AVOID_RODS.includes(rod.Name) || (Number.isFinite(rod.Strength) && Math.round(rod.Strength! * (rod.Worlds?.includes(this.Worlds?.[0]) ? 1 : 0.5)) < (this.WeightPool[0] / 10))) continue
								
								// if (!this.Worlds?.find(world => rod.Worlds?.includes(world))) continue
								// if ((zone == 'Brine Pool Water' || zone == 'Brine Pool') && rod.Name != 'Reinforced Rod') continue
								// if (zone == 'Lava' && rod.Name != 'Reinforced Rod' && rod.Name != 'Magma Rod') continue
								if (zone == 'Notes Island Pool' && rod.Name != 'Flimsy Rod') continue
								if (ZoneData[zone]?.ExclusiveRods && !ZoneData[zone]?.ExclusiveRods?.[0]?.includes(rod.Name)) continue
								
								const conditions = {
									zone, time, weather, season, bait,
									luck: rod.Luck,
									max_weight: rod.Strength!,
									rod: rod.Name,
									world: this.Worlds?.[0],
									rod_worlds: rod.Worlds ?? []
								}
								const rawChance = this.getPercentChanceWithCondition(conditions) * 100
								// const chance = roundTo(rawChance, rawChance < 1 ? rawChance < 0.1 ? 3 : 2 : 1)
								const score = getConditionScore(conditions, this, rawChance)
								
								const rodsTarget = weather == 'Aurora Borealis' ? rodsAurora : rodsNormal
								if (!rodsTarget[rod.Name]) {
									rodsTarget[rod.Name] = [score, rawChance]
								}
								if (score > rodsTarget[rod.Name]?.[0]) {
									rodsTarget[rod.Name][0] = score
								}
								if (rawChance > rodsTarget[rod.Name]?.[1]) {
									rodsTarget[rod.Name][1] = rawChance
								}
							}
						}
					}
				}
			}
		}
		
		return { normal: rodsNormal, aurora: rodsAurora }
	}
	
	getAvailabilityCall(alreadyRecommmended?: string[]): string[] {
		const zones = this.getZones()
		if (zones.length == 0) return []
		
		let call = ['{{Fish Availability|']
		zones.forEach(zone => call.push(zone))

		const { normal, aurora } = this.getBestRods()
		
		const normalTopScore = Object.entries(normal)
			.sort(([, c0], [, c1]) => c1[0] - c0[0])
			.slice(0, 5)
			.map(([name]) => name)

		const normalTopChance = Object.entries(normal) // if two chances are the exact same, fallback to score to sort them
			.sort(([, c0], [, c1]) => (c1[1] - c0[1]) || (c1[0] - c0[0]))
			.slice(0, 3)
			.map(([name]) => name)
			
		const auroraTopScore = Object.entries(aurora)
			.sort(([, c0], [, c1]) => c1[0] - c0[0])
			.slice(0, 5)
			.map(([name]) => name)

		const auroraTopChance = Object.entries(aurora) // if two chances are the exact same, fallback to score to sort them
			.sort(([, c0], [, c1]) => (c1[1] - c0[1]) || (c1[0] - c0[0]))
			.slice(0, 3)
			.map(([name]) => name)
		
		const recommended = RECOMMENDED_RODS
			.filter(rod => (normal[rod] && normal[rod][1] > 0) || (aurora[rod] && aurora[rod][1] > 0))
		
		const finalList = new Set<string>()
		
		if (this.IsCrate) {
			recommended.push('Magnet Rod')
		}
		
		if (this.Name == 'Scylla') {
			recommended.push("Leviathan's Fang Rod")
		}
		
		if (this.From == 'Roslit Volcano' || this.From == 'Brine Pool') {
			recommended.push('Reinforced Rod')
		}
		
		if (this.From == 'Roslit Volcano') {
			recommended.push('Magma Rod')
		}

		normalTopScore.forEach(r => finalList.add(r))
		normalTopChance.forEach(r => finalList.add(r))
		auroraTopScore.forEach(r => finalList.add(r))
		auroraTopChance.forEach(r => finalList.add(r))
		recommended
			.sort((r0, r1) => normal[r1]?.[0] - normal[r0]?.[0])
			.forEach(r => finalList.add(r))
		alreadyRecommmended
			?.filter(r => r)
			?.forEach(r => finalList.add(r?.replace(/\\.+$/, '')))
			
		let recInTemplate = alreadyRecommmended?.join('; ')
		if (!recInTemplate) {
			recInTemplate = recommended.find(r => {
				let rod = FishingRod.fromName(r)
				return rod.Worlds?.find(w => this.Worlds.includes(w) && (w != 'Sea 1' || !rod.Worlds?.includes('Sea 2')))
			}) || ''
		}
		
		call.push(
			`|top_rods      = \n${[...finalList.values()].map(rod => `${rod}\\${roundTo(normal[rod]?.[0], 2)}\\${roundTo(aurora[rod]?.[0], 2)}`).join(';\n')}`,
			`|recommended   = ${recInTemplate}`
		)
		
		call.push('}}')
		
		return call
	}
}