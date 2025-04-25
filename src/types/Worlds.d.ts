/**
 * Types for "data/Worlds.json"
 */

import type { Color } from '../util/Color.ts';
import type { World } from './Shared.js';

export interface WorldCurrencyData {
	LabelProperties: { TextColor: Color }
	Formatting: string
	Display: string
	DataPath: string
	Icon: string
	DataName: string
}

export interface WorldData {
	Display: string
	Currency: string
	LevelCap: number
	InvalidWorldModifiers: {
		Rod?: number
	}
	XpPerLevel: number
	DefaultBestiary: string
	['Sea Level']: number
}

export interface WorldsLibrary {
	DefaultPlace: World
	Currencies: Record<string, WorldCurrencyData>
	Games: Record<string, Record<World, number>>
	WorldStats: Record<World, WorldData>
	Places: Record<string, World>
}