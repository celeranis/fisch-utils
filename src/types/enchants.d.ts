/**
 * Types for "data/enchants.json"
 */

import type { Color } from '../util/Color.ts'
import { World } from './Shared.js'

export interface EnchantData {
	Display: string
	Description: string
	
	StatIncrease: number
	
	MutationStatIncrease?: number
	ProgressSpeedBoost?: number
	WeightIncrease?: number
	ControlIncrease?: number
	ElectricMutationChance?: number
	LuckStatIncrease?: number
	PurifiedChance?: number
	LureSpeedBonus?: number
	AltProgressSpeedBoost?: number
	
	Color: Color
	StrokeColor: Color
	
	IsExalted?: boolean
	IsSongOfTheDeep?: boolean
	
	Worlds?: World[]
}

export interface EnchantsLibrary {
	Enchants: Record<string, EnchantData>
}