/**
 * Types for "data/mutations.json"
 */

import { Color } from '../util/Color.ts'

export interface MutationData {
	Display: string
	PriceMultiply: number
	Color: Color
	Chance: number
	SpecificZones: string[]
}

export interface MutationsLibrary {
	Mutations: Record<string, MutationData>
}