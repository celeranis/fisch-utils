export type Rarity = 'Trash' | 'Common' | 'Uncommon' | 'Unusual' | 'Rare' | 'Legendary' | 'Mythical' | 'Relic' | 'Limited' | 'Exotic' | 'Fragment' | 'Gemstone' | 'Secret'

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter'
export type Weather = 'Clear' | 'Foggy' | 'Rain' | 'Windy' | 'Eclipse' | 'Aurora Borealis'
export type World = 'Sea 1' | 'Sea 2'
export type Time = 'Day' | 'Night'

export interface Requirements {
	GatesOpened?: string[]
}