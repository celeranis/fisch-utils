/**
 * Types for "data/rods.json"
 */

import type { Color } from '../util/Color.ts'
import type { Requirements, World } from './Shared.js'

export interface RodData {
	Icon?: string
	Description: string
	From?: string
	Worlds: World[]
	
	// OBTAINMENT CRITERIA //
	Price: number | null
	Unpurchasable?: boolean
	MinDistanceToPurchase?: number
	RequireWorkspaceAttributeToBeTrue?: string
	Unregistered?: boolean
	DEV?: boolean
	Requiriments?: Requirements
	BestiaryRequirement?: {
		Requirement: number
		Island?: string
	}
	
	// STATS //
	Strength: number | null
	LureSpeed: number
	Luck: number
	Control: number
	Resilience: number
	LineDistance: number
	ProgressEfficiency?: number
	Passive?: string
	
	// OTHER COSMETIC //
	Color: Color
	BobberTop: Color
	SplashSound?: unknown
}

export type RodsLibrary = Record<string, RodData>