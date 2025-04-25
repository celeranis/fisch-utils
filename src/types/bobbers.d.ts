/**
 * Types for "data/bobbers.json"
 */
import type { Rarity } from './Shared.js'

export interface BobberData {
	Icon: string
	Name: string
	Rarity: Rarity
}

export interface BobberLibrary {
	Bobbers: Record<string, BobberData>
}