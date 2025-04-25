/**
 * Types for "data/fish.json"
 */

import type { Color } from '../util/Color.ts'
import type { Rarity, Requirements, Season, Time, Weather, World } from './Shared.js'

export interface FishSubValues {
	Mutation?: string
	Season?: string
}

export interface CustomProgressEfficiencyEntry {
	Rod?: string
	/** Unlike the `ProgressEfficiency` value, this value reflects the in-game value (divided by 100). */
	Value: number
}

export interface FishData {
	Icon?: string
	
	// BASE STATS //
	/**
	 * An array containing the minimum and maximum weights for this fish multiplied by 10. 
	 * Divide by 10 to get accurate values.
	 */
	WeightPool: [number, number]
	Chance: number
	Rarity: Rarity
	Resilience: number
	/** This fish's price at the maximum of its WeightPool. */
	Price: number
	XP: number

	// BESTIARY //
	
	/** This fish's description after it has been unlocked in the Bestiary. */
	Description: string
	/** This fish's description before it has been unlocked in the Bestiary. */
	Hint: string
	/** The Bestiary this fish belongs to. */
	From?: string
	/** The Limited Bestiary this fish belongs to. May not always be used. */
	FromLimited?: string
	/** The World(s) (seas) this fish belongs to. */
	Worlds?: World[]

	// PREFERENCES //
	
	FavouriteBait?: string | null
	FavouriteTime?: Time | null
	Seasons: (Season | 'None')[]
	Weather: (Weather | 'None')[]
	
	// PROGRESS EFFICIENCY //

	/** Standard progress efficiency multiplier. In-game display can be calculated as `(ProgressEfficiency - 1) * 100`. */
	ProgressEfficiency?: number
	/** Conditional progress speed modifiers. */
	CustomProgressEfficiency?: CustomProgressEfficiencyEntry[]
	/** If `true`, this fish will **always** have a Progress Efficiency of 1× unless the player is using the Leviathan's Fang Rod. */
	IgnoreProgressEfficiency?: boolean
	
	// TYPE FLAGS //
	
	Shark?: boolean
	IsPearl?: boolean
	IsCrate?: boolean
	FromMeteor?: boolean
	
	// CRATES //
	
	CrateType?: 'FishOrCoins' | 'FishAndCoins' | 'Bait' | 'All'
	BaitContents?: string[]
	CoinContents?: [number, number]
	FishContents?: string[]
	BuyMult?: number
	
	// BEHAVIOR FLAGS //
	
	/** Hides the fish model in the water while a player reels it in. */
	HideFishModel?: boolean
	/** Prevents this fish by being caught by most Fishing Rod passives that can catch additional fish. */
	BlockPassiveCapture?: boolean
	/** Completely hides the fish in the bestiary, even after it is obtained */
	HideInBestiary?: boolean
	/** Declares that this fish is from a limited bestiary, even if other parameters suggest otherwise */
	IsLimitedBestiary?: boolean
	
	// ADDITIONAL COSMETIC STUFF //
	
	/** The Meteoriticist's dialogue when shown this fish (should be a Gemstone) */
	Evaluation?: string
	Quips: string[]
	SparkleColor: Color
	HoldAnimation?: unknown
	ViewportSizeOffset?: number
	
	// MISC //
	Requiriments?: Requirements
}

export type FishLibrary = Record<string, FishData>