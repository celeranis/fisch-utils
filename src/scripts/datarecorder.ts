// This script was used to collect in-game fishing data to compare against the calculator's predictions.
// It is no longer used and has not been updated in months, but it has been preserved here in case it is ever needed in the future.
// Records are stored in output/records.json

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { Fish, ZoneData } from '../Fish.js'

export interface RecordEntry {
	fish: string
	season: string
	time: string
	weather: string
	bait?: string
	rodLuck: number
	miniLuck: boolean
	merlinLuck: boolean
	notff: boolean
	date: string
	serverLuck?: number
	zone: string
	abundance?: string
}

if (!existsSync('./output/records.json')) {
	mkdirSync('./output/', { recursive: true })
	await writeFile('./output/records.json', '[]')
}

let currentData: RecordEntry[] = JSON.parse((await readFile('./output/records.json')).toString())

let season: number | undefined = undefined
let time: 'd' | 'n' | undefined = undefined
let weather: 'r' | 'w' | 'f' | 'c' | 'ab' | 'e' | undefined = undefined
let bait: string | undefined = undefined
let zone: string | undefined = undefined
let rodLuck: number | undefined = undefined
let miniLuck: boolean = false
let merlinLuck: boolean = false
let serverLuck: number = 1
let notff: boolean = false
let abundance: string | undefined = undefined

const allFish = Fish.loadAll()

const SEASON_NAMES = ['Spring', 'Summer', 'Autumn', 'Winter']
const TIME_DISPLAY = {
	d: 'Day',
	n: 'Night'
}
const WEATHER_DISPLAY = {
	r: 'Rain',
	w: 'Windy',
	f: 'Foggy',
	c: 'Clear',
	ab: 'Aurora Borealis',
	e: 'Eclipse'
}

const FISH_DISPLAY = {
	SS: 'Scurvy Sailfish',
	CG: "Captain's Goldfish",
	CSG: 'Corsair Grouper',
	BC: 'Bait Crate',
	CC: 'Common Crate',
	FB: 'Fish Barrel',
	CF: 'Cutlass Fish',
	RR: 'Reefrunner Snapper',
	
	SW: 'Seaweed',
	BOOT: 'Boot',
	TIRE: 'Tire',
	
	EC: 'Enchant Relic',
	
	IC: 'Icicle',
	OLM: 'Olmdeer',
	CK: 'Cookie',
	SP: 'Supreme Present',
	GF: 'Gingerbread Fish',
	OF: 'Ornament Fish',
	SAS: 'Santa Salmon',
	GOM: 'Glass of Milk',
	FBC: 'Festive Bait Crate',
	SAP: 'Santa Pufferfish',
	BP: 'Basic Present',
	NS: 'Northstar Serpent',
	UP: 'Unique Present',
	CCC: 'Candy Cane Carp',
	SF: 'Snowflake Flounder',
	
	DF: 'Destroyed Fossil',
	SM: 'Scrap Metal',
	DSD: 'Deep-sea Dragonfish',
	DSH: 'Deep-sea Hatchetfish',
	TEF: 'Three-eyed Fish',
	DO: 'Depth Octopus',
	FS: 'Frilled Shark',
	LM: 'Luminescent Minnow',
	GS: 'Goblin Shark',
	SC: 'Spider Crab',
	BDF: 'Black Dragon Fish',
	SSC: 'Small Spine Chimera',
	NT: 'Nautilus',
	AE: 'Ancient Eel',
	MS: 'Mutated Shark',
	SSN: 'Sea Snake',
	BF: 'Barreleye Fish',
	ADS: 'Ancient Depth Serpent',
	
	R: 'Rock',
	BS: 'Basalt',
	MT: 'Magma Tang',
	ES: 'Ember Snapper',
	EP: 'Ember Perch',
	PG: 'Pyrogrub',
	VG: 'Volcanic Geode',
	QBC: 'Quality Bait Crate',
	OS: 'Obsidian Salmon',
	OSW: 'Obsidian Swordfish',
	MB: 'Molten Banshee',
}

function setSeason(arg: string | number) {
	let asNumber = typeof arg == 'number' ? arg : Number.parseInt(arg)
	let newSeason = Number.isFinite(asNumber) ? asNumber : SEASON_NAMES.indexOf(arg as string)
	
	if (!SEASON_NAMES[newSeason]) {
		console.warn(`Unknown season ${arg}`)
		return
	}
	
	season = newSeason
	console.log(`Set season to ${SEASON_NAMES[newSeason]}`)
}

function setTime(newTime: string) {
	if (!TIME_DISPLAY[newTime]) {
		console.warn(`Unknown time ${newTime}`)
		return
	}
	
	time = newTime as any
	console.log(`Set time to ${TIME_DISPLAY[newTime]}`)
}

function setWeather(newWeather: string) {
	if (!WEATHER_DISPLAY[newWeather]) {
		console.warn(`Unknown weather ${newWeather}`)
		return
	}

	weather = newWeather as any
	console.log(`Set weather to ${WEATHER_DISPLAY[newWeather]}`)
}

function setBait(newBait?: string) {
	if (!newBait || newBait?.trim()?.toLowerCase() == 'none') {
		newBait = undefined
	}
	
	bait = newBait || undefined
	console.log(`Set bait to ${newBait || 'None'}`)
}

function setRodLuck(newLuck: number) {
	rodLuck = newLuck
	console.log(`Set rod luck to ${newLuck}%`)
}

function toggleMiniLuck() {
	miniLuck = !miniLuck
	console.log(`Toggled mini-luck to ${miniLuck}`)
}

function toggleMerlinLuck() {
	merlinLuck = !merlinLuck
	console.log(`Toggled Merlin luck to ${merlinLuck}`)
}

function setZone(newZone: string) {
	if (!ZoneData[newZone]) {
		console.warn(`Unknown zone "${newZone}"!`)
		return
	}
	
	zone = newZone
	console.log(`Set zone to "${newZone}"`)
}

function addFish(fish: string) {
	if (FISH_DISPLAY[fish.toUpperCase()]) {
		fish = FISH_DISPLAY[fish.toUpperCase()]
	}
	
	const fishData = allFish.find(f => f.Name.toUpperCase() == fish.toUpperCase())
	
	if (!fishData) {
		console.error(`Unknown fish "${fish}"`)
		return
	}
	
	if (season == undefined) {
		console.error('Season must be set before logging fish!')
		return
	}
	
	if (time == undefined) {
		console.error(`Time must be set before logging fish!`)
		return
	}
	
	if (weather == undefined) {
		console.error(`Weather must be set before logging fish!`)
		return
	}
	
	if (rodLuck == undefined) {
		console.error(`Rod luck must be set before logging fish!`)
		return
	}
	
	if (zone == undefined) {
		console.error(`Zone must be set before logging fish!`)
		return
	}
	
	currentData.push({
		fish: fishData.Name,
		season: SEASON_NAMES[season],
		time: TIME_DISPLAY[time],
		weather: WEATHER_DISPLAY[weather],
		bait,
		rodLuck,
		miniLuck,
		merlinLuck,
		notff,
		zone,
		serverLuck,
		abundance,
		date: new Date().toLocaleString()
	})
	
	writeFileSync('./output/records.json', JSON.stringify(currentData, null, '\t'))
	
	console.log(`Logged ${fishData.Name}`)
}

function logConditions() {
	console.log(`\nSeason: ${SEASON_NAMES[season!] || 'Unset'} | Time: ${TIME_DISPLAY[time!] || 'Unset'} | Weather: ${WEATHER_DISPLAY[weather!] || 'Unset'}\n| Bait: ${bait || 'None'} | Luck: ${rodLuck ?? 'Unset'} | Zone: ${zone ?? 'Unset'}\n| Total: ${currentData.length}`)
	if (merlinLuck) {
		console.log('Merlin luck active')
	}
	if (miniLuck) {
		console.log('Mini-event luck active')
	}
	if (notff) {
		console.log('Night of the Fireflies active')
	}
	if (serverLuck != 1) {
		console.log(`Server luck: ${serverLuck}x`)
	}
	if (abundance) {
		console.log('Abundance:', abundance)
	}
}

process.stdin.on('data', (data) => {
	const input = data.toString().trim()
	const args = input.split(' ')
	
	switch (args[0].toLowerCase()) {
		case 'season':
			setSeason(args[1])
			break
		case 'spring':
			setSeason(0)
			break
		case 'summer':
			setSeason(1)
			break
		case 'autumn':
		case 'fall':
			setSeason(2)
			break
		case 'winter':
			setSeason(3)
		
		case 'time':
			setTime(args[1])
			break
		case 'day':
			setTime('d')
			break
		case 'night':
			setTime('n')
			break
			
		case 'weather':
			setWeather(args[1])
			break
		case 'rain':
		case 'rainy':
			setWeather('r')
			break
		case 'wind':
		case 'windy':
			setWeather('w')
			break
		case 'fog':
		case 'foggy':
			setWeather('f')
			break
		case 'clear':
			setWeather('c')
			break
		case 'eclipse':
			setWeather('e')
			break
		
		case 'bait':
			setBait(args.slice(1).join(' '))
			break
		
		case 'luck':
			setRodLuck(Number(args[1]))
			break
		
		case 'miniluck':
			toggleMiniLuck()
			break
		
		case 'merlin':
		case 'merlinluck':
			toggleMerlinLuck()
			break
			
		case 'notff':
			notff = !notff
			break
			
		case 'zone':
			setZone(args.slice(1).join(' '))
			break
		
		case 'sluck':
			serverLuck = Number(args[1])
			break
			
		case 'abundance':
		case 'abund':
			abundance = args.slice(1).join(' ') || undefined
			break
			
		default:
			addFish(input)
			break
	}
	
	logConditions()
})

console.log(`Loaded datarecorder`)
console.group('commands:')
console.log('zone <name> - set the current fishing zone (ask if unsure)')
console.log('season <name> - set the current season')
console.log('<day/night> - set the time to day or night respectively')
console.log('<clear/windy/foggy/rain> - set the weather accordingly')
console.log('bait <name> - set the current bait (use None if not using any)')
console.log(`luck <number> - set the current fishing rod luck`)
console.log('sluck <number> - set server luck')
console.log('merlinluck - toggle merlin luck')
console.log('miniluck - toggle the fishing luck mini-event')
console.log('notff - toggle Night of the Fireflies')
console.log('otherwise, enter the name of a fish to log it under the current conditions')
console.groupEnd()
console.log('data is saved automatically to output/records.json')

logConditions()