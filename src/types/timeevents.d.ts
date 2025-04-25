/**
 * Types for "data/timeevents.json"
 */

export interface ZoneModification {
	AffectedAreas: string[]
	Insert: string[]
	Remove: string[]
}

export interface TimeEventData {
	Version: number
	EndTime: Date
	StartTime: Date
	ZoneModifications: ZoneModification[]
	Bestiary: string[]

	Rewards?: unknown

	StartMessage?: string
	BestiaryCompletedMessage?: string
}

export interface TimeEventsLibrary {
	Events: Record<string, TimeEventData>
	CurrentEvent: string
}