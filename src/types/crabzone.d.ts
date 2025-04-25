/**
 * Types for "data/crabzone.json"
 */

export interface CrabZoneData {
	Pool: string[]
	Priority: number
}

export type CrabZonesLibrary = Record<string, CrabZoneData>