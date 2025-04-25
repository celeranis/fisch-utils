/**
 * Types for "data/Locations.json"
 */

import { Color } from '../util/Color.ts'
import type { World } from './Shared.js'

export interface LocationData {
	Name: string
	Worlds: World[]
	
	Banner: string
	Color: Color
	
	BadgeId: number
	Bobber?: string
	Rewards: {
		Xp: number
		Coins: number
	}
	
	Hide?: boolean
	Limited?: boolean
}

export type LocationsLibrary = Record<string, LocationData>