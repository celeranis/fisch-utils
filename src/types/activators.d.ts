/**
 * Types for "data/activators.json"
 */
import type { FishSubValues } from './Fish.js'

export interface ActivatorData {
	PlaceableItems: string[]
	Type: 'Client'
	SubValues?: FishSubValues
}

export type ActivatorsLibrary = Record<string, ActivatorData>