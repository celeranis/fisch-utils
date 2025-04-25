/**
 * Types for "data/items.json"
 */

import type { Color } from '../util/Color.ts';
import type { Rarity } from './Shared.js';

export interface ItemData {
	Rarity: Rarity
	Price?: number | null
	SellValue?: number
	Icon?: string

	OnlyBuyOne?: boolean
	Unpurchasable?: boolean
	NonPersistent?: boolean
	
	DataInstanceRequiriment?: [path: string, expectedValue: boolean | number, errorMessage: string]
}

export interface ItemsLibrary {
	Rarities: string[]
	RarityColours: Record<string, Color>
	Items: Record<string, ItemData>
}