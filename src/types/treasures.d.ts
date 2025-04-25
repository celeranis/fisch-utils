/**
 * Types for "data/treasures.json"
 */

import { FishSubValues } from './Fish.js';

export interface TreasureDropEntry {
	Subvalues: FishSubValues
	Category: 'Baits' | 'Item' | 'Bobbers' | 'Fish' | 'XP' | 'Rods'
	Chance: number
	DYNAMIC?: boolean
	Amount: number | {
		Min: number,
		Max: number
	}
	ItemId: string
}

export interface TreasuresLibrary {
	Loots: {
		Default: TreasureDropEntry[]
	}
}