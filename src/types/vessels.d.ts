/**
 * Types for "data/vessels.json"
 */

import type { Vector } from '../util/Vector.ts'

export interface VesselData {
	Description: string
	ObtainText: string
	Icon: string
	
	// OBTAINMENT //
	Price: number
	Level: number
	ProductId?: number
	FakePrice?: number
	LimitedAmount?: number
	ExpirationDate?: Date
	Unpurchasable?: boolean

	// PUBLIC STATS //
	MaxSpeed: number
	Accel: number
	TurningSpeed: number
	
	// HIDDEN STATS //
	BackwardsEfficiency: number
	StopEfficiency: number
	Bobbing: number
	BobbingSpeed: number
	AlternateSpawn: number
	
	// MODEL STATS //
	SeatCount: number
	PassengerSeatCount: number
	ModelDimensions: Vector
	
	// SUBMARINE //
	IsSubmarine?: boolean
	SubmarineTier?: 'Common' | 'Heat' | 'Ice' | 'Deep'
}

export type VesselsLibrary = Record<string, VesselData>