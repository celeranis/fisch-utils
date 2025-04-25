/**
 * Types for "data/zones.json"
 */

export interface ZoneData {
	Pool: string[]
	CantBeWhormholed?: boolean
	Priority: number
	InvalidDate?: Date
}

export type ZonesLibrary = Record<string, ZoneData>