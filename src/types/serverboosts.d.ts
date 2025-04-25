/**
 * Types for "data/serverboosts.json"
 */

export type ServerBoostData = [type: string, value: number, start: Date, end: Date]

export interface ServerBoostType {
	Icon?: unknown
	Name: string
	Description: string
}

export interface ServerBoostsLibrary {
	Activated: ServerBoostData[]
	List: Record<string, ServerBoostData>
}