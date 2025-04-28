import { IGNORE_BAIT } from './Constants.js'
import { getFile } from './DataParser.js'
import { Fish } from './Fish.js'
import { BaitData, BaitLibrary } from './types/bait.js'
import { Rarity } from './types/Shared.js'

export const baitData: BaitLibrary = await getFile('bait.json')

export class Bait {
	rarity: Rarity
	universal_luck: number
	preferred_luck: number
	resilience: number
	lure_speed: number
	mutation?: string
	mutation_chance?: number
	
	constructor(public name: string, data: BaitData) {
		this.rarity = data.Rarity
		this.universal_luck = data.GenerelLuck ?? 0
		this.preferred_luck = data.Luck ?? 0
		this.resilience = data.Resilience ?? 0
		this.lure_speed = data.LureSpeed ?? 0
		this.mutation = data.Mutation
		this.mutation_chance = data.MutationChance ? ((data.MutationChance[2] - (data.MutationChance[0] - 1)) / (data.MutationChance[1] - (data.MutationChance[0] - 1))) * 100 : 100
	}
	
	static fromName(name: string): Bait | undefined {
		if (!baitData[name]) {
			return undefined
		}
		return new this(name, baitData[name])
	}
	
	static loadAll(): Bait[] {
		return Object.entries(baitData)
			.filter(([name]) => !IGNORE_BAIT.includes(name))
			.map(([name, data]) => new this(name, data))
	}
	
	getCrateSources() {
		const crates = Fish.getCrates()
			.filter(crate => crate.BaitContents?.includes(this.name))
			.sort((c0, c1) => c0.Name.localeCompare(c1.Name))
			
		const result: Record<string, number> = {}
		
		for (const crate of crates) {
			const thisWeight = crate.BaitContents!.reduce((weight, baitName) => weight += (baitName == this.name ? 1 : 0), 0)
			const percent = thisWeight / crate.BaitContents!.length
			let avgPerCrate = percent * 4 * 1.45
			if (crate.CrateType == 'All') {
				avgPerCrate /= 3
			}
			result[crate.Name] = avgPerCrate
		}
		
		return result
	}
}