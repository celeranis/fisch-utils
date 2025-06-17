import { writeFile } from 'fs/promises';
import { Bait } from '../Bait.js';
import { AVOID_POOLS, CANT_REBUFF, crabZoneMap, DISPLAY_LOCATIONS, FISH_NAME_OVERRIDES, EVENT_MAP, FIXED_CHANCE_POOLS, HARDCODED_PENALTIES, HUNT_MAP, IGNORE_ZONES, LIMITED_BAIT, LIMITED_POOLS, locationRefer, OVERRIDE_SEA, SEA_DISPLAY, UNFISHABLE_ZONES, ZONE_DISPLAY } from '../Constants.js';
import { getFile } from '../DataParser.js';
import { Enchantment } from '../Enchant.js';
import { crabZoneData, Fish, locationData, ZoneData as zoneData } from '../Fish.js';
import { FishingRod } from '../FishingRod.js';
import { meta } from '../Meta.js';
import { AbundancesLibrary } from '../types/abundances.js';
import { ServerBoostsLibrary } from '../types/serverboosts.js';
import { Rarity } from '../types/Shared.js';
import { TimeEventsLibrary } from '../types/timeevents.js';
import { ZoneData } from '../types/zones.js';
import { a, roundTo } from '../util/General.js';
import { jsonToLua } from '../util/LuaObject.js';
import { MUTATION_DATA, MUTATION_MULTIPLIERS } from '../util/MutationCalcData.js';
import { Template } from '../util/Template.js';

const allFish = Fish.loadAll()
	.filter(fish => fish.Rarity)
	.sort((f1, f2) => f1.getSortIndex() - f2.getSortIndex())

interface NavboxDataSection {
	name: string
	fish: { name: string, rarity: Rarity }[]
}

const EVENT_LOCS = new Set<string>()
allFish.forEach(fish => (fish.FromLimited || fish.IsLimitedBestiary) && EVENT_LOCS.add(fish.FromLimited ?? fish.From!))

Object.entries(locationData).forEach(([, loc]) => loc.Limited && EVENT_LOCS.add(loc.Name))

const bestiaryOrder: Record<string, number> = {}
const rarityData: Record<string, Rarity> = {}
const navboxData = {
	permanent: Object.entries(locationData)
		.filter(([, loc]) => loc.Name && !EVENT_LOCS.has(loc.Name) && loc.Name != 'All')
		.map(([iname, loc]) => ({ name: DISPLAY_LOCATIONS[iname] ?? DISPLAY_LOCATIONS[loc.Name] ?? loc.Name, fish: [] })) as NavboxDataSection[],
		
	limited: Object.entries(locationData)
		.filter(([, loc]) => loc.Name && EVENT_LOCS.has(loc.Name))
		.map(([iname, loc]) => ({ name: DISPLAY_LOCATIONS[iname] ?? DISPLAY_LOCATIONS[loc.Name] ?? loc.Name, fish: [] })) as NavboxDataSection[],
}

function emptyIfNone(val?: string) {
	if (val == 'None') return ''
	return val || ''
}

if (!process.argv.includes('--skip-pages')) {
	const lastUpdateComment = `-- Last update: Version [[${meta.official_version}]], place version ${meta.place_version}`
	
	for (const [i, fish] of allFish.entries()) {
		fish.DisplayName = fish.DisplayName.replaceAll("’", "'")
		if (process.argv.includes('--only') && !process.argv.includes(fish.DisplayName.replaceAll(' ', '_'))) continue
		const page: string[] = [
			// pageInfoHeader(fish.Name),
			new Template('FishInfobox', {
				image: `${fish.DisplayName}.png`,
				rarity: fish.Rarity,
				event: EVENT_MAP[fish.From!] || fish.FromLimited || undefined,
				sea: fish.Worlds.map(sea => SEA_DISPLAY[sea] ?? sea).join(', '),
				location: fish.getInfoboxLocation() ? `[[${fish.getInfoboxLocation()}]]` : (fish.FromLimited == 'Fischmas' ? 'Winter Village' : 'Regionless'),
				sublocation: fish.getInfoboxSublocation(),
				sources: fish.getSources(allFish).sort().join(', '),
				nopassive: fish.BlockPassiveCapture ? '1' : undefined,
				radar_location: '',
				prog_speed: fish.ProgressSpeed == 0 ? undefined : `${fish.ProgressSpeed > 0 ? '+' : ''}${roundTo(fish.ProgressSpeed * 100, 3)}`,
				xp: fish.XP,
				weather: emptyIfNone(fish.Weather
					?.filter(w => w == 'Clear' || w == 'Windy' || w == 'Rain' || w == 'Foggy' || w == 'Aurora Borealis' || w == 'Eclipse')
					?.join(', ')),
				time: emptyIfNone(fish.FavouriteTime),
				season: emptyIfNone(fish.Seasons
					?.filter(s => s == 'Spring' || s == 'Summer' || s == 'Autumn' || s == 'Winter')
					?.join(', ')),
				bait: emptyIfNone(fish.FavouriteBait),
				base_weight: `${fish.WeightPool[1] / 10}`,
				base_value: `${fish.Price}`,
				weight_range: `${fish.getRange()}`,
				base_chance: fish.Chance,
				base_resil: fish.Resilience
			}).block(),
			`'''${fish.DisplayName}''' is ${a(fish.Rarity)} {{Rarity|${fish.Rarity}}} fish found in ${locationRefer[fish.getInfoboxSublocation() || fish.getInfoboxLocation()!] || locationRefer[fish.getInfoboxLocation()!] || locationRefer[fish.FromLimited!] || (fish.getInfoboxLocation() && `[[${fish.getInfoboxLocation()}]]`) || 'any body of water'}${fish.FromLimited ? ` during the [[${fish.FromLimited}]] event` : ''}.`,
			'',
			'== Description ==',
			`{{Description|${fish.Description ?? '???'}|Bestiary Entry}}`,
			'',
			'== Obtainment ==' +
			((fish.Hint && fish.Hint != '???') ? `\n{{Description|${fish.Hint}|Bestiary Hint}}` : ''),
			...fish.getAvailabilityCall()
		]
		bestiaryOrder[fish.DisplayName] = i
		rarityData[fish.DisplayName] = fish.Rarity

		if (!fish.HideInBestiary) {
			const useLimited = (fish.FromLimited == 'Archeological Site' && fish.Name.includes(' Algae')) ? 'Golden Tide' : fish.FromLimited == 'Love' ? "Valentine's Day" : fish.FromLimited
			navboxData[(fish.FromLimited ?? EVENT_LOCS.has(fish.From!)) ? 'limited' : 'permanent']
				.find(sect => sect.name == (useLimited ?? fish.getInfoboxLocation() ?? 'Regionless'))
				?.fish.push({ name: fish.DisplayName, rarity: fish.Rarity })
		}

		const contents = fish.getContents()
		// note: this is currently oudated
		if (contents.size > 0) {
			page.push(
				'',
				`== Contents ==`,
				`Opening ${a(fish.DisplayName)} ${fish.DisplayName} will yield at least one of the following:`,
				[...contents.values()].map(content => `* [[${content.includes('(Bait)') ? `Bait#${content.replace(/\s+\(Bait\)/, '')}|${content.replace(/\s+\(Bait\)/, '')}` : content}]]`).join('\n'),
			)
		}

		if (fish.HideFishModel || fish.BlockPassiveCapture || fish.CustomProgressEfficiency) {
			page.push('', '== Gameplay Notes ==')
			if (fish.HideFishModel) {
				page.push(`* While reeling in ${a(fish.DisplayName)} ${fish.DisplayName}, the fish will ''not'' be visible in the water.`)
			}
			if (fish.BlockPassiveCapture) {
				page.push(
					`* ${fish.DisplayName} usually cannot be caught with passive effects, such as the one provided by the [[Rod Of The Depths]] and [[Rod Of The Forgotten Fang]].`,
					`** The only exception is when catching a ${fish.DisplayName} on the Megalodon Passive reel of the [[Rod Of The Forgotten Fang]], the Megalodon will instead dupe the ${fish.DisplayName}.`
				)
			}
			if (fish.CustomProgressEfficiency) {
				page.push(`* The ${fish.DisplayName} Progress Speed penalty cannot be reduced with the {{Enchantment|Steady}} [[Enchantment]] or the {{Item|Tempest Rod}} passive ability.`)
			}
		}

		if (fish.Quips?.length) {
			page.push(
				'',
				'== Catch Quips ==',
				`When catching ${a(fish.DisplayName)} ${fish.DisplayName}, the player has a chance to make one of the following exclamations:`,
				fish.Quips?.map(quip => `* ${quip}`).join('\n') || '???',
			)
		}

		page.push(
			'',
			'== Change History ==',
			`{{Change History|{{subst:Current Version}}}}`,
			'',
			'== Navigation ==',
			`{{Fish Navbox|${fish.FromLimited ?? fish.getInfoboxLocation() ?? 'Regionless'}}}`
		)

		await writeFile(`./output/fish/${fish.DisplayName}.wikitext`, page.join('\n'))
		console.log(`[${i}/${allFish.length}] Generated page for ${fish.DisplayName}`)
	}

	await writeFile('./output/BestiaryOrder.lua', lastUpdateComment + '\n\nreturn ' + jsonToLua(bestiaryOrder))
	await writeFile('./output/RarityData.lua', lastUpdateComment + '\n\nreturn ' + jsonToLua(rarityData))

	navboxData.limited.sort((e0, e1) => e0.name.localeCompare(e1.name))
	navboxData.permanent.sort((e0, e1) => e0.name == 'Regionless' ? 1 : e1.name == 'Regionless' ? -1 : e0.name.localeCompare(e1.name))

	await writeFile('./output/NavboxData.lua', `${lastUpdateComment}\n\nreturn ` + jsonToLua(navboxData, { basic_key_levels: true, single_line_levels: [5] }))
}

const abundanceData = Object.fromEntries(Object.entries(await getFile('abundances.json') as AbundancesLibrary)
	.filter(([k]) => k != 'Brine Pool Water')
	.map(([k, v]) => [(k == 'Brine Pool' ? 'Desolate Deep/Brine Pool' : ZONE_DISPLAY[k]) ?? k, v]))
	
const abundanceData_sea2 = Object.fromEntries(Object.entries(await getFile('abundances_sea2.json') as AbundancesLibrary)
	.map(([k, v]) => [ZONE_DISPLAY[k] ?? k, v]))

function getWHSeasForZone(fishNames: string[]) {
	const validSeas: string[] = []
	for (const [internal, display] of Object.entries(SEA_DISPLAY)) {
		let include = true
		for (const fishName of fishNames) {
			const fish = Fish.fromName(fishName)
			if (!fish?._no_defined_worlds && !fish?.Worlds?.includes(internal)) {
				include = false
				break
			}
		}
		if (include) {
			validSeas.push(display)
		}
	}
	return validSeas
}

const limitedPools = Object.keys(LIMITED_POOLS).map(pool => ZONE_DISPLAY[pool] ?? pool)

const pools = Object.fromEntries((Object.entries(zoneData)
	.filter(([k]) => !IGNORE_ZONES.includes(k))
	.map(([k, v]) => [k == 'Brine Pool' ? 'Brine Pool/Unused' : (ZONE_DISPLAY[k] ?? k), v]) as [string, ZoneData][])
	.toSorted(([k], [k1]) => k.localeCompare(k1))
	.map(([k, v]) => ([k, {
		name: k,
		display: k.replaceAll('/', ' — '),
		// category: `Catchable in ${k.replaceAll('/', ': ')}`,
		fish: v.Pool.map((fishName) => (FISH_NAME_OVERRIDES?.[fishName] ?? fishName).replaceAll('’', "'")),
		hunt_fish: HUNT_MAP[k],
		no_wormhole: v.CantBeWhormholed || undefined,
		wormhole_only: UNFISHABLE_ZONES.includes(k) || undefined,
		can_lucky: (abundanceData[k] ?? abundanceData_sea2[k])?.can_lucky ?? false,
		sea: OVERRIDE_SEA[k] ?? (abundanceData_sea2[k] ? 'Second Sea' : 'First Sea'),
		limited: limitedPools.includes(k) || undefined,
		avoid: AVOID_POOLS[k] || undefined,
		wormhole_seas: v.CantBeWhormholed ? undefined : getWHSeasForZone(v.Pool),
		
		abundances: (abundanceData[k] ?? abundanceData_sea2[k])?.abundances
			?.sort((a0, a1) => a0.fish.localeCompare(a1.fish) || ((a1.position && a0.position?.compareTo(a1.position)) ?? -1))
			?.map(a => ({
				fish: (FISH_NAME_OVERRIDES?.[a.fish] ?? a.fish).replaceAll("’", "'"),
				chance: a.chance,
				hidden: a.hidden,
				position: a.position?.round()?.toArray(),
				can_lucky: a.can_lucky ?? false,
			})) ?? [],
		// crab_pools: abundanceData[k]?.crab_zones?.map(v => crabZoneMap[v] ?? v),
		force_abundance: abundanceData[k]?.force_abundance
	}])))

pools['Ocean/Strange Whirlpool'].abundances = [{
	fish: "Isonade",
	chance: 2,
	can_lucky: false,
	hidden: false,
	position: undefined
}]
pools['Ocean/Strange Whirlpool'].force_abundance = true

pools['Roslit Bay/Ashfall'].abundances = [{
	fish: "Ember Catfish",
	chance: undefined,
	hidden: true,
	position: [ -1798, 127, 404 ],
	can_lucky: false,
}]
pools['Roslit Bay/Ashfall'].force_abundance = true

pools['The Depths/Absolute Darkness'].abundances = [{
	fish: "Ancient Depth Serpent",
	chance: 30,
	can_lucky: false,
	hidden: false,
	position: undefined,
}]
pools['The Depths/Absolute Darkness'].force_abundance = true

pools['Desolate Deep/Brine Pool'].force_abundance = false

pools['Cults Curse'].abundances = [{
	fish: "Bloodscript Eel",
	chance: undefined,
	hidden: true,
	position: [ 713, 2124, 16960 ],
	can_lucky: false,
}]
pools['Roslit Bay/Ashfall'].force_abundance = true

const rods = Object.fromEntries(FishingRod.getNonDev()
	.sort((r0, r1) => r0.Name.localeCompare(r1.Name))
	.map(rod => {
		return [rod.Name, {
			name: rod.Name,
			seas: rod.Worlds?.map(sea => SEA_DISPLAY[sea] ?? sea) ?? [],
			luck: rod.Luck,
			max_weight: rod.Strength ?? null,
			lure: 100 - rod.LureSpeed,
			resilience: rod.Resilience,
			control: rod.Control,
			passive: rod.getPassiveData(),
			no_rebuff: CANT_REBUFF.includes(rod.Name) || undefined,
		}]
	})
)

const bait = Object.fromEntries(Bait.loadAll()
	.sort((b0, b1) => b0.name.localeCompare(b1.name))
	.map(bait => [bait.name, {
		preferred_luck: bait.preferred_luck,
		universal_luck: bait.universal_luck,
		lure: bait.lure_speed,
		resilience: bait.resilience,
		rarity: bait.rarity,
		limited: LIMITED_BAIT[bait.name] || undefined,
	}]))

const fishOrder: Record<string, number> = {}
allFish.forEach((fish, i) => fishOrder[fish.DisplayName] = i)

const fish = Object.fromEntries(
	allFish
		.filter(fish => fish.Name != 'Eyefestation')
		.sort((f0, f1) => f0.Name.localeCompare(f1.Name))
		.map((fish, i) => {
			fish.DisplayName = fish.DisplayName.replaceAll("’", "'")
			return [fish.DisplayName, {
				name: fish.DisplayName,
				order: fishOrder[fish.DisplayName],
				rarity: fish.Rarity,
				weather: fish.Weather,
				time: fish.FavouriteTime,
				seasons: fish.Seasons,
				bait: fish.FavouriteBait,
				is_crate: fish.IsCrate,
				min_weight: fish.WeightPool[0] / 10,
				max_weight: fish.WeightPool[1] / 10,
				base_value: fish.Price,
				xp: fish.XP,
				resilience: fish.Resilience,
				prog_speed: fish.ProgressSpeed || undefined,
				base_chance: fish.Chance,
				hard_penalty: HARDCODED_PENALTIES[fish.Name] || undefined
			}]
		})
)

const crab_pools = Object.fromEntries(
	Object.entries(crabZoneData)
		.map(([name, data]) => [crabZoneMap[name] ?? name, {
			name: crabZoneMap[name] ?? name,
			fish: data.Pool
		}])
)

interface PoolModification {
	on: string[]
	add: string[]
	remove: string[]
}

interface LimitedEvent {
	name: string
	start?: string
	end?: string
	pool_changes?: PoolModification[]
	crab_cages?: boolean
}

const limitedEventData = await getFile<TimeEventsLibrary>('timeevents.json')
const serverBoostData = await getFile<ServerBoostsLibrary>('serverboosts.json')
const limited_events = Object.fromEntries(
	Object.entries(limitedEventData.Events)
		.filter(([, data]) => data.ZoneModifications.length > 0)
		.map(([name, data]): [string, LimitedEvent] => [name, {
			name,
			start: data.StartTime.toISOString(),
			end: data.EndTime.toISOString(),
			pool_changes: data.ZoneModifications.map(zm => ({
				on: zm.AffectedAreas.map(zoneName => ZONE_DISPLAY[zoneName] ?? zoneName),
				add: zm.Insert,
				remove: zm.Remove
			}))
		}])
)

const fgEnd = zoneData.Fischgiving.InvalidDate!
limited_events.Fischgiving = {
	name: 'Fischgiving',
	start: `${fgEnd.getUTCFullYear()}-11-30T13:00:00.000Z`,
	end: fgEnd.toISOString(),
	pool_changes: []
}

const luckyBoost = serverBoostData.Activated.find(([type]) => type == 'Lucky')
const xpBoost = serverBoostData.Activated.find(([type]) => type == 'Xp')

limited_events['Lucky Event'] = {
	name: 'Lucky Event',
	start: luckyBoost?.[2]?.toISOString(),
	end: luckyBoost?.[3]?.toISOString(),
}

limited_events['Double XP'] = {
	name: 'Double XP',
	start: xpBoost?.[2]?.toISOString(),
	end: xpBoost?.[3]?.toISOString(),
	crab_cages: true
}

const calcData = {
	pools,
	fixed_chance_pools: FIXED_CHANCE_POOLS,
	crab_pools,
	bait,
	mutations: MUTATION_DATA,
	mutation_values: MUTATION_MULTIPLIERS,
	rods,
	fish,
	limited_events,
	enchants: Object.fromEntries(
		Enchantment.getAll()
		.sort((e0, e1) => e0.name.localeCompare(e1.name))
		.map(enchant => [enchant.name, enchant.getBoosts()])
	)
}
await writeFile('./output/CalcData.json', JSON.stringify(calcData, null, '\t'))