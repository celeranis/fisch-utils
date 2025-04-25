/**
 * Types for "data/bait.json"
 */
import type { Rarity } from './Shared.js'

export interface BaitData {
	LureSpeed: number
	/** Preferred Luck */
	Luck: number
	/** Universal Luck */
	GenerelLuck: number
	Rarity: Rarity
	Resilience: number
	Mutation?: string
	MutationChance?: [number, number, number]
	Icon: string
	DontGiveToANewAccount?: boolean
}

export type BaitLibrary = Record<string, BaitData>