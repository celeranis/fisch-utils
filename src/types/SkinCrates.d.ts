/**
 * Types for "data/SkinCrates.json"
 */

import type { Color, ColorSequence } from '../util/Color.ts'
import { World } from './Shared.js'

export type ServerBoostData = [type: string, value: number, start: Date, end: Date]

export interface SkinCrateContentsEntry {
	Value: string
	Type: 'Rod'
	Weight: number
}

export interface SkinCrateData {
	CrateName: string
	Icon: string
	DisplayText: string
	LayoutOrder: number
	TargetLocation: string
	New?: boolean
	
	Price: number
	LastPrice: number
	ProductId?: number
	Currency: 'Coins' | 'Embercoins'
	Worlds: World[]
	
	Color: Color
	GradientColor: ColorSequence
	
	List: SkinCrateContentsEntry[]
}

export interface SkinCratesLibrary {
	Banner: string[]
	List: Record<string, SkinCrateData>
}