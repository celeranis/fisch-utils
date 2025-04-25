/**
 * Types for "data/titles.json"
 */

import type { Color, ColorSequence } from '../util/Color.ts'

export interface TitleData {
	StrokeColor: Color
	Text: string
	TextColor: Color | ColorSequence
	Italic?: boolean
	Bold?: boolean
	RankInGroup?: number
	Animated?: boolean
	GradientRotation?: number
	CustomFont?: {
		Family: string
		Weight: 'Thin' | 'ExtraLight' | 'Light' | 'Regular' | 'Medium' | 'SemiBold' | 'Bold' | 'ExtraBold' | 'Heavy'
		Style: 'Normal' | 'Italic'
	}
}

export type TitlesLibrary = Record<string, TitleData>