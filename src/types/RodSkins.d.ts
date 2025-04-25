/**
 * Types for "data/RodSkins.json"
 */

import type { Color, ColorSequence } from '../util/Color.ts'

export type SkinRarity = 'Common' | 'Rare' | 'Legendary'

export interface RodSkinData {
	DisplayText?: string
	Icon: string
	Description?: string
	TimeToExpire?: number
	Limited?: boolean
	DevProduct?: number
	TargetRod: string
	Rarity: SkinRarity
}

export interface SkinRarityData {
	Color: Color
	ColorSequence: ColorSequence
	RefoundPercentage: number
	Weight: number
}

export interface RodSkinsLibrary {
	Skins: Record<string, RodSkinData>
	Rarities: Record<SkinRarity, SkinRarityData>
	RodSkins: Record<string, Record<string, RodSkinData>>
}