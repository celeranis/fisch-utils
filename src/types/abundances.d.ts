/**
 * Types for "data/abundances.json" and "data/abundances_sea2.json"
 */
import type { Vector } from '../util/Vector.ts'

export interface AbundanceData {
	fish: string
	position?: Vector
	chance?: number
	can_lucky?: boolean
	hidden?: boolean
}

export interface ZoneWorldData {
	abundances: AbundanceData[]
	crab_zones: string[]
	can_lucky?: boolean
	force_abundance?: boolean
}

export type AbundancesLibrary = Record<string, ZoneWorldData>