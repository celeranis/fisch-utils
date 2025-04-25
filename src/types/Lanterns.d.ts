import type { Color } from '../util/Color.ts';

export interface LanternLight {
	Color: Color
	Brightness: number
	Range: number
}

export interface LanternSound {
	Name: string
	SoundId: string
	PlaybackSpeed: number
	Volume: number
}

export interface LanternData {
	DisplayText: string
	Icon: string
	Exclusive: boolean
	
	Lights?: LanternLight[]
	Sounds?: LanternSound[]
}

export type LanternsLibrary = Record<string, LanternData>