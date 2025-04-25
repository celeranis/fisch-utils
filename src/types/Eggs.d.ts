export interface EggPossibleItem {
	Chance: number
	Amount?: number | null
	Item: string
	Category: 'Coins' | 'Title' | 'Cosmetic Case' | 'Boat' | 'Submarine' | 'Embercoins' | 'Bait'
}

export interface EggData {
	Items: EggPossibleItem[]
	ArePaidRandomItemsRestricted: boolean
	DisplayName: string
}

export type EggsLibrary = Record<string, EggData>