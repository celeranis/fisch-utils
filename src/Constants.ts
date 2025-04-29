import { Color } from './util/Color.js'

// Additional passive data may be found in FishingRods.ts, Enchant.ts, and util/MutationCalcData.ts

/**
 * A map of Bestiary location names to their full/corrected ones.
 */
export const DISPLAY_LOCATIONS = {
	'Mushgrove': 'Mushgrove Swamp',
	'Roslit': 'Roslit Bay',
	'Snowcap': 'Snowcap Island',
	'Sunstone': 'Sunstone Island',
	'Terrapin': 'Terrapin Island',
	'Love': "Valentine's Day",
	'Octophant': 'Animals: Octophant',
	'Pine Shoal': 'Pine Shoals',
	'Moosewood': 'Moosewood',
	"Brickford's": 'LEGO Event',
	
	// override the display name of just "Blue Moon"
	'Blue Moon - First Sea': 'Blue Moon - First Sea',
	'Blue Moon - Second Sea': 'Blue Moon - Second Sea',
	
	'None': undefined
}

/**
 * A map of internal fishing zone names to unofficial user-facing ones.
 * Forward slashes are replaced with hyphens or colons by the wiki's templates.
 */
export const ZONE_DISPLAY: Record<string, string> = {
	'The Depths - Serpent': 'The Depths/Absolute Darkness',
	'Megalodon Default': 'Megalodon Hunt/Normal',
	'Megalodon Ancient': 'Megalodon Hunt/Eclipse and Weekend',
	'Great White Shark': 'Shark Hunt/Great White Shark',
	'Great Hammerhead Shark': 'Shark Hunt/Great Hammerhead Shark',
	'Whale Shark': 'Shark Hunt/Whale Shark',
	'Isonade': 'Ocean/Strange Whirlpool',
	'FischFright24': 'FischFright/Frightful Pool',
	'Forsaken Shores Pond': `Forsaken Shores/Freshwater Pond`,
	'Forsaken Shores Ocean': 'Forsaken Shores/Surrounding Ocean',
	'Moosewood Ocean': 'Moosewood/Surrounding Ocean',
	'Moosewood Ocean Mythical': 'Moosewood/Seaweed and Mini-Island',
	'Moosewood Docks': 'Moosewood/Docks',
	'Moosewood Pond': 'Moosewood/Freshwater Pond',
	'Lava': 'Roslit Bay/Roslit Volcano',
	'Roslit Bay': 'Roslit Bay/Coral Reef',
	'Roslit Pond': 'Roslit Bay/Freshwater Pond',
	'Roslit Pond Seaweed': 'Roslit Bay/Freshwater Pond Seaweed',
	'Roslit Bay Clam': 'Roslit Bay/Clam Abundance',
	'Roslit Bay Ocean': 'Roslit Bay/Surrounding Ocean',
	'Brine Pool Water': 'Desolate Deep/Brine Pool',
	'Brine Pool': 'Desolate Deep/Brine Pool',
	'Ancient Isle Ocean': 'Ancient Isle/Surrounding Ocean',
	'Ancient Isle Pond': 'Ancient Isle/Freshwater Pond',
	'Ancient Isle Waterfall': 'Ancient Isle/Waterfall',
	'Terrapin Ocean': 'Terrapin Island/Surrounding Ocean',
	'Terrapin Olm': 'Terrapin Island/Olm Cave',
	'Mushgrove Water': 'Mushgrove Swamp',
	'Snowcap Pond': 'Snowcap Island/Freshwater Pond',
	'Snowcap Ocean': 'Snowcap Island/Surrounding Ocean',
	'Sunstone': 'Sunstone Island',
	'Sunstone Hidden': 'Sunstone Island/Crate Cave',
	'Scallop Ocean': 'Ocean/Hidden Scallop Abundance',
	'Vertigo': "Vertigo/Vertigos Dip",
	'Fischmas24': 'Fischmas/Winter Village',
	'Deep Ocean': 'Ocean/Deep Ocean',
	'Harvesters Spike': 'Ocean/Harvesters Spike',
	'The Depths': 'The Depths',
	'The Arch': 'Ocean/The Arch',
	'Desolate Deep': 'Desolate Deep/Desolate Pocket',
	'Forsaken Shores': 'Forsaken Shores/Coral Reef',
	'The Summit Ocean': 'Northern Summit/Surrounding Ocean',
	'Atlantean Storm': 'Grand Reef/Atlantean Storm',
	
	'Forsaken Algae Pool': 'Forsaken Shores/Algae Hunt',
	'Ancient Algae Pool': 'Ancient Isle/Algae Hunt',
	'Mushgrove Algae Pool': 'Mushgrove Swamp/Algae Hunt',
	'Snowcap Algae Pool': 'Snowcap Island/Algae Hunt',
	
	'Poseidon Pool': 'Atlantis/Poseidon Temple',
	'Ancient Kraken Pool': 'Atlantis/Ancient Kraken Hunt',
	'The Kraken Pool': 'Atlantis/Kraken Hunt',
	'Kraken Pool': 'Atlantis/Kraken Pool',
	'Atlantis Ocean': 'Atlantis/Surrounding Ocean',
	'Ethereal Abyss': 'Atlantis/Ethereal Abyss',
	"Sunken's Depth": 'Atlantis/Sunken Depths',
	'Zeus Pool': "Atlantis/Zeus's Rod Room",
	
	'Orcas Pool': 'Orca Migration/Normal',
	'Ancient Orcas Pool': 'Orca Migration/Ancient',
	'Whales Pool': 'Whale Migration/Normal',
	
	'Lovestorm Eel Supercharged': 'Lovestorm/Supercharged',
	'Lovestorm Eel': 'Lovestorm/Normal',
	
	'Ocean Greedy': 'Ocean/Unused',
	
	'Ashfall Pool': 'Roslit Bay/Ashfall',
	
	'Volcanic Vents': "Mariana's Veil/Volcanic Vents",
	'Forsaken Veil - Scylla': "Mariana's Veil/Scylla Hunt",
	'Calm Zone': "Mariana's Veil/Calm Zone",
	'Abyssal Zenith': "Mariana's Veil/Abyssal Zenith",
	'Forsaken Veil': "Mariana's Veil/Veil of the Forsaken",
	'Challengers Deep': "Mariana's Veil/Challenger's Deep",
	
	"Rowdy McCharm": 'Lucky Event/Rowdy McCharm',
	"O'Mango Goldgrin": "Lucky Event/O'Mango Goldgrin",
	"Clover McRich": "Lucky Event/Clover McRich",
	"Sunny O'Coin": "Lucky Event/Sunny O'Coin",
	"Blarney McBreeze": "Lucky Event/Blarney McBreeze",
	"Plumrick O'Luck": "Lucky Event/Plumrick O'Luck",
	
	'Cults Curse Pool': 'Cults Curse',
	'Notes Island Pool': "Crypt of the Green One",
	
	'Sea Leviathan Pool': 'Open Ocean/Sea Leviathan',
	'Pine Shoal': 'Pine Shoals',
	'Emberreach Ponds': 'Emberreach/Freshwater Pond',
	'Emberreach': 'Emberreach/Surrounding Ocean',
	'Emberreach Lava': 'Emberreach/Volcano',
	
	'Octophant Pool With Elephant': 'Octophant Hunt/Octophant Catchable',
	'Octophant Pool Without Elephant': 'Octophant Hunt/Octophant Uncatchable',
	'Animal Pool': 'Animal Hunt/First Sea',
	'Animal Pool - Second Sea': 'Animal Hunt/Second Sea',
	
	'Blue Moon - First Sea': 'Blue Moon/First Sea',
	'Blue Moon - Second Sea': 'Blue Moon/Second Sea',
	
	'LEGO': 'LEGO Pool',
	'LEGO - Studolodon': 'LEGO Pool/Studalodon Hunt',
}

/**
 * Fishing locations that cannot be directly fished into **or** wormholed.
 * Unless referenced again elsewhere (fixed chance pools), these zones will be entirely ignored.
 */
export const IGNORE_ZONES = ['Debug', 'Relics', 'Fischgiving', 'ExaltedRelics', 'DevTest']

/**
 * Fishing locations that cannot be directly fished into, but are still included by Wormhole.
 */
export const UNFISHABLE_ZONES = ['Ocean Greedy', 'Brine Pool', 'Ocean/Unused', 'Brine Pool/Unused', 'Lucky Event/Clover McRich', 'Clover McRich']

/**
 * A map of Bestiary locations to a corresponding blurb of text in the page introduction.
 * If unspecified, the format will default to a link to the location.
 */
export const locationRefer = {
	'Brine Pool': "the [[Desolate Deep]]'s [[Desolate Deep#Brine Pool|Brine Pool]]",
	'Desolate Deep': 'the [[Desolate Deep]]',
	'Keepers Altar': 'the [[Keepers Altar]]',
	'Ocean': 'the [[Ocean]]',
	'Roslit Volcano': 'the [[Roslit Bay#Roslit Volcano|Volcano]] in [[Roslit Bay]]',
	'Shark Hunt': '[[Shark Hunt]]s',
	'Ancient Isle': `the [[Ancient Isle]]`,
	'Ancient Archives': 'the [[Ancient Archives]]',
	'Fischmas': 'the [[Winter Village]]',
	'Cryogenic Canal': 'the [[Cryogenic Canal]]',
	'Overgrowth Caves': 'the [[Overgrowth Caves]]',
	'Frigid Cavern': 'the [[Frigid Cavern]]',
	'Glacial Grotto': 'the [[Glacial Grotto]]',
	'Grand Reef': "the [[Grand Reef]]",
	'Golden Tide': 'special pools in the [[Ocean]]',
	'Atlantean Storm': "the [[Atlantean Storm]]",
	'Love': '[[Lovestorm]]s during the [[Valentine\'s Day]] event',
	'Ashfall': '[[Roslit Bay]]\'s saltwater',
	"Lucky Event": "within the [[Lucky Event]]",
	
	"Crypt": "the [[Crypt of the Green One]]",
	"Cults Curse Pool": "the [[Cults Curse Pool]]",
	
	"Abyssal Zenith": "the [[Abyssal Zenith]] of [[Mariana's Veil]]",
	"Veil of the Forsaken": "the [[Veil of the Forsaken]] of [[Mariana's Veil]]",
	"Challenger's Deep": "the [[Challenger's Deep]] of [[Mariana's Veil]]",
	"Calm Zone": "the [[Calm Zone]] of [[Mariana's Veil]]",
	'Volcanic Vents': "[[Volcanic Vents]] of [[Mariana's Veil]]",
	
	'Azure Lagoon': 'the [[Azure Lagoon]]',
	'Open Ocean': 'the [[Open Ocean]]',
	'Isle of New Beginnings': 'the [[Isle of New Beginnings]]',
	
	'Animals': '[[Animal Hunt]]s in the [[First Sea]]',
	'Animals - Sea 2': '[[Animal Hunt]]s in the [[Second Sea]]',
	'Animals: Octophant': '[[Octophant Hunt]]s in the [[Second Sea]]',
	
	'Blue Moon - First Sea': '[[Blue Moon]] events at [[Snowcap Island]]',
	'Blue Moon - Second Sea': '[[Blue Moon]] events at [[Lushgrove]]',
	
	'LEGO Event': '[[LEGO Pool]]s',
}

/**
 * Used to map multiple Bestiary locations to a single associated event.
 */
export const EVENT_MAP = {
	'Octophant': 'Animal Hunt',
	'Animals: Octophant': 'Animal Hunt',
	'Animals': 'Animal Hunt',
	'Animals - Sea 2': 'Animal Hunt',
	'LEGO Event': 'LEGO Event',
}

/**
 * A list of Fishing Rod names which cannot be rebuffed at the Rebuff Altar.
 */
export const CANT_REBUFF = [
	'No-Life Rod',
	'Seraphic Rod'
]

/**
 * Rods that should *always* be included in Recommended Conditions if they can catch the target fish.
 * These rods are also used to generate default "Community-Recommended" rods (by community request).
 */
export const RECOMMENDED_RODS = [
	"Steady Rod",
	"Avalanche Rod",
	"Depthseeker Rod",
	"Trident Rod",
	"Rod Of The Depths",
	"Rod Of The Exalted One",
	"No-Life Rod",
	"Rod Of The Forgotten Fang",
	"Seraphic Rod",
	"Zeus Rod",
	
	"Training Rod",
	
	"Volcanic Rod",
	"Challenger's Rod",
	"Ethereal Prism Rod",
	
	"Blazebringer Rod",
	"Verdant Shear Rod",
	"Free Spirit Rod",
]

/**
 * Used to filter out unavailable event pools from Recommended Conditions calculations.
 * 
 * Each key is the name of a Zone, while the value is the name of the associated event.
 * 
 * If the fish is specifically *from* that event, or it cannot be caught in any other pool,
 * then it will still be considered for Recommended Conditions.
 */
export const LIMITED_POOLS = {
	"Rowdy McCharm": 'Lucky Event',
	"O'Mango Goldgrin": "Lucky Event",
	"Clover McRich": "Lucky Event",
	"Sunny O'Coin": "Lucky Event",
	"Blarney McBreeze": "Lucky Event",
	"Plumrick O'Luck": "Lucky Event",
	
	"Lovestorm Eel": "Love",
	"Lovestorm Eel Supercharged": "Love",
	
	"Ashfall Pool": "Ashfall",
	"Fischmas24": "Fischmas",
	"FischFright24": "FischFright",
	"Golden Tide": "Golden Tide",
	"Forsaken Algae Pool": "Golden Tide",
	'Ancient Algae Pool': 'Golden Tide',
	'Mushgrove Algae Pool': 'Golden Tide',
	'Snowcap Algae Pool': 'Golden Tide',

	"Cults Curse": "Cults Curse",
	"Notes Island Pool": "Crypt",

	'Octophant Pool': 'Octophant',
	'Animal Pool': 'Animals',
	'Animal Pool - Second Sea': 'Animals - Sea 2',
}

/**
 * Additional zones that arent actually from events,
 * but should still be avoided in Recommended Conditions as much as possible
 * due to limited spawn conditions or redundancy
 */
export const AVOID_POOLS = {
	"Megalodon Hunt/Normal": true,
	"Megalodon Hunt/Eclipse and Weekend": true,
	"Orca Migration/Ancient": true,
	"Atlantis/Ancient Kraken Hunt": true,
	"Atlantis/Kraken Hunt": true,
	"Open Ocean/Sea Leviathan": true,
	"Whale Migration/Normal": true,
	"Whale Migration/Moby": true,
	"Mariana's Veil/Scylla Hunt": true,
	"The Depths/Absolute Darkness": true,

	// 1:1 with ocean
	"Atlantis/Surrounding Ocean": true,
	"Northern Summit/Surrounding Ocean": true,
}

/**
 * Fishing Rods exclusive to developers or content creators
 * that should not appear in Recommended Conditions.
 * 
 * Only rods that have been added to the wiki need to be added here.
 */
export const AVOID_RODS = [
	'Tryhard Rod',
	'Clickbait Caster',
	'Fish Photographer',
	'Sovereign Doombringer',
]

/**
 * Bait types that should be avoided in Recommended Conditions due to exceptionally difficult obtainment criteria.
 * 
 * This can be adjusted by individual users in the Recommended Conditions "Configure" menu.
 */
export const LIMITED_BAIT = {
	"Hangman's Hook": true,
	"Kraken Tentacle": true,
	"Golden Tentacle": true,
	"Peppermint Worm": true,
	"Holly Berry": true,
	"Aurora Bait": true,
	"Chocolate Fish": true,
	"Lucky": true,
	
	"Glass Beetle": true,
	"Phantom Leech": true,
	"Neuro Slug": true,
	"Toxic Jelly Core": true,
	"Nightmare Larva": true,
	"Golden Worm": true,
}

/**
 * A map of internal "World" names to nicer "Sea" names for use on the wiki.
 */
export const SEA_DISPLAY = {
	'Sea 1': 'First Sea',
	'Sea 2': 'Second Sea'
} as const

/**
 * Divides the final weighted fish chance by a specific number.
 * 
 * For more information, see https://fischipedia.org/wiki/Luck#Other_Fish_Chance_Modifications
 */
export const HARDCODED_PENALTIES = {
	'Northstar Serpent': 12,
	'Spectral Serpent': 3.5,
	'Molten Banshee': 3,
	'Treble Bass': 5,
	'Banana': 8,
	'Crystallized Seadragon': 12,
	'Magma Leviathan': 20,
	'Frozen Leviathan': 20,
	'Crowned Anglerfish': 4,
}

/**
 * A map of fishing location names to Abundances that are always present in them.
 * Useful as some event pools (such as Ancient Depth serpent) will often not appear in decompilations.
 */
export const ZONE_ABUNDANCE_MAP: Record<string, { abundance_for: string, abundance_chance?: number }> = {
	'Roslit Bay Clam': {
		abundance_for: 'Clam',
		abundance_chance: 2500
	},
	'Isonade': {
		abundance_for: 'Isonade',
		abundance_chance: 2,
	},
	'Lava': {
		abundance_for: 'Basalt',
	},
	'Megalodon Default': {
		abundance_for: 'Megalodon'
	},
	'Megalodon Ancient': {
		abundance_for: 'Megalodon'
	},
	'Sunstone Hidden': {
		abundance_for: 'Common Crate',
		abundance_chance: 30,
	},
	'Roslit Pond Seaweed': {
		abundance_for: 'Suckermouth Catfish',
		abundance_chance: 10,
	},
	'Keepers Altar': {
		abundance_for: 'Salmon',
		abundance_chance: 60,
	},
	'Forsaken Algae Pool': {
		abundance_for: 'Forsaken Algae',
		abundance_chance: 100,
	},
	'Ancient Algae Pool': {
		abundance_for: 'Ancient Algae',
		abundance_chance: 100,
	},
	'Mushgrove Algae Pool': {
		abundance_for: 'Mushgrove Algae',
		abundance_chance: 100,
	},
	'Snowcap Algae Pool': {
		abundance_for: 'Snowcap Algae',
		abundance_chance: 100,
	},
	'Ashfall Pool': {
		abundance_for: 'Ember Catfish'
	},
	'The Depths - Serpent': {
		abundance_for: 'Ancient Depth Serpent',
		abundance_chance: 30
	},
	'Cults Curse': {
		abundance_for: 'Bloodscript Eel'
	}
}

/**
 * Used to override the "DEV" parameter in Fishing Rod data
 * when determining whether a certain rod is exclusive to developers and/or admins.
 */
export const DEV_OVERRIDES = {
	// not marked as DEV, but should be
	'Developers Rod': true,
	'Executive Rod': true,
	'Superstar Rod': true,

	// unused
	'Frostbane Rod': true,
	
	// marked as DEV, but should not be
	'No-Life Rod': false,
	'Seraphic Rod': false,
	
	// correctly marked as DEV, but publicly documented on the wiki
	'Sovereign Doombringer': false,
	'Clickbait Caster': false,
	'Fish Photographer': false,
	'Tryhard Rod': false,
}

/**
 * Overrides the text color of specific Fishing Rods
 * if the original was unreadable or overused.
 */
export const ROD_COLOR_OVERRIDES: Record<string, Color> = {
	// craftables
	'Wisdom Rod': new Color(92, 81, 7),
	'Precision Rod': Color.fromHex('003aff'),

	// northern expedition
	'Avalanche Rod': Color.fromHex('629bde'),
	'Arctic Rod': Color.fromHex('92b3da'),
	'Crystalized Rod': Color.fromHex('da7000'),
	'Firework Rod': Color.fromHex('9c1919'),
	'Summit Rod': Color.fromHex('50cae6'),
	'Ice Warpers Rod': Color.fromHex('6ebdf7'),

	// atlantis
	'Abyssal Specter Rod': Color.fromHex('51de87'),
	'Champions Rod': Color.fromHex('dba303'),
	'Kraken Rod': Color.fromHex('7c3132'),
	'Poseidon Rod': Color.fromHex('fcf861'),
	'Tempest Rod': Color.fromHex('37fdff'),
	'Depthseeker Rod': Color.fromHex('2fc3ff'),
}

/**
 * Overrides the text color of specific Mutations
 * if the original was unreadable or overused.
 */
export const MUTATION_COLOR_OVERRIDES: Record<string, string> = {
	'Charred': '939393',
}

/**
 * Used to map Crab Cage zones to user-facing names.
 * This is rarely updated in practice,
 * as Crab Cages have largely been abandoned by the developers.
 */
export const crabZoneMap = {
	'Glacial Grotto': 'Northern Expedition, Grand Reef',
	'Frigid Cavern': 'Northern Expedition, Grand Reef',
	'Overgrowth Caves': 'Northern Expedition, Grand Reef',
	'Cryogenic Canal': 'Northern Expedition, Grand Reef',
	'Grand Reef': 'Northern Expedition, Grand Reef',
	'Default': 'Moosewood Pond',
	'Scallop': 'Hidden Scallop Abundance',
	'Lobster': 'Sunstone Crate Cave',
	'Desolate': 'Desolate Deep',
	'Swamp': 'Mushgrove Swamp',
	'Coast': 'Haddock Rock, Sardine Abundance',
	'Exotic': 'Sunstone Island',
	'Docks': 'Moosewood Docks, Snowcap Docks, Forsaken Shores',
	'Depths': 'The Depths',
	'Ocean': 'Ocean, Snowcap Island, Ancient Isle',
	'Terrapin': 'Terrapin Island',
	'King Oyster': 'Terrapin Olm Cave',
	'Cheap Pond': 'Roslit Bay, Snowcap Pond'
}

/**
 * Used to override the sea associated with a certain fishing location.
 * This is typically only needed for event pools such as the Sea Leviathan Hunt.
 * If unspecified here, these pools will instead be considered to be part of the First Sea.
 */
export const OVERRIDE_SEA = {
	'Open Ocean/Sea Leviathan': 'Second Sea',
	'Octophant Hunt/Octophant Catchable': 'Second Sea',
	'Octophant Hunt/Octophant Uncatchable': 'Second Sea',
	'Animal Hunt/Second Sea': 'Second Sea',
	'Blue Moon/Second Sea': 'Second Sea',
}

/**
 * sha1 hashes of developer/admin-exclusive titles.
 * 
 * Anything that matches these will not be included in script output.
 */
export const DEV_TITLE_HASHES = [
	'1791e69f29949e80254eca63f4e36709341c525a',
	'e5a75b6e7e0160994a780a1c24efec339a1a8c88',
	'4c897be4e3af5b5b74e33327452e8be03e80809f',
	'2d86c2a659e364e9abba49ea6ffcd53dd5559f05',
	'ff9899bc36904b8fb2fac6a5e1d0c8ee556afd00',
	'0a2af398fe476e7bf791ae096a749f33bd8cd91b',
	'21c62b2fe352709b4af8978aa62fbc7ed7f049b1',
	'7c02a56aa862d0f2debf62c26d470db90ba54861',
	'860dccdf48a1268affcdecbde4372a7466614bb7',
	'6eef6648406c333a4035cd5e60d0bf2ecf2606d7',
	'84605ce9daa579198735db294b562a7dcca25163',
	'bce8c9aca4120776fad6b517874aa09c46405454',
	'e2148f52b5a3905d3228d54226e198e86f5d4156',
	'e0769b0c6d1c2d8f61eb424f7d0fc92dcd218198',
	'e4213900cfb03bf4700fbb2e273fd4a2707314f6',
	'b454109993438542163d132d897313eee1b480fa',
	'aadbabf207e6f3494bd339e48554e92a74a5018d',
	'e52c854d5631eec7468ba4727b4c77eb745f2965',
	'98f6fb2b390f774cd6f86d76656009fb21f53177',
	'9e8860157064465a302279a4ad357a70ec7c79a2',
	'ad521a1fbaf481dd862bb1ed619b2d645dd1a68f',
	'648ab88a7ccde4b120e6f58d3efb41d92472676a',
	'28f00eb09ae1db44f7ac21eae85fe262d4545c81',
	'31aa039fcdf85aac567c630bd9822d8fbe240067',
]

/**
 * Bait names that should be excluded from script output for now.
 */
export const IGNORE_BAIT = [
	'Colossal Ink Bait',
	'Hourglass Bait',
]

/**
 * Mutations that should be excluded from script output for now.
 */
export const DEV_MUTATIONS = [
	"Mila's Magic",
	'Red',
	'Yellow',
	'Green',
	'Blue',
	'Pink',
	'Colossal Ink',
	'Neon',
]

/**
 * A map of user-facing zone names to their associated hunt fish.
 * Used by the "Hunt Target Depleted" toggle in the calculator.
 */
export const HUNT_MAP = {
	'Megalodon Hunt/Normal': ['Ancient Megalodon', 'Megalodon'],
	'Megalodon Hunt/Eclipse and Weekend': ['Ancient Megalodon', 'Megalodon', 'Phantom Megalodon'],
	
	'Orca Migration/Normal': ['Orca'],
	'Orca Migration/Ancient': ['Ancient Orca'],
	
	'Whale Migration/Normal': ['Blue Whale'],
	'Whale Migration/Moby': ['Blue Whale'], // moby omitted intentionally, as it does not directly use the fishing chance system
	
	'Atlantis/Ancient Kraken Hunt': ['Ancient Kraken', 'The Kraken'],
	'Atlantis/Kraken Hunt': ['The Kraken'],
	
	"Mariana's Veil/Scylla Hunt": ['Scylla'],
	
	'Lovestorm/Normal': ['Lovestorm Eel'],
	'Lovestorm/Supercharged': ['Lovestorm Eel Supercharged'],
	
	"Lucky Event/Blarney McBreeze": ['Blarney McBreeze'],
	"Lucky Event/O'Mango Goldgrin": ["O'Mango Goldgrin"],
	"Lucky Event/Plumrick O'Luck": ["Plumrick O'Luck"],
	"Lucky Event/Rowdy McCharm": ["Rowdy McCharm"],
	"Lucky Event/Sunny O'Coin": ["Sunny O'Coin"],
	
	"Ancient Isle/Algae Hunt": ["Ancient Algae"],
	"Forsaken Shores/Algae Hunt": ["Forsaken Algae"],
	"Mushgrove Swamp/Algae Hunt": ["Mushgrove Algae"],
	"Snowcap Island/Algae Hunt": ["Snowcap Algae"],
	
	"LEGO Pool/Studalodon Hunt": ["Studalodon"],
}

/**
 * Special pools with a fixed chance of activating,
 * hardcoded into the game's fishing module.
 */
export const FIXED_CHANCE_POOLS = [
	{
		name: 'Fischgiving',
		chance: 1 / 250,
		conditions: [
			{
				check: 'conditions',
				op: 'contains_any',
				property: 'limitedEvents',
				values: ['Fischgiving']
			}
		],
		fish: ['Turkey']
	},
	{
		name: 'Exalted Relics',
		chance: 1 / 2000, // base chance
		conditions: [
			{
				check: 'conditions',
				op: 'not',
				property: 'rod',
				values: ['Rod Of The Exalted One']
			},
			{
				check: 'conditions',
				op: 'not',
				property: 'enchant',
				values: ['Scavenger']
			}
		],
		fish: ['Exalted Relic']
	},
	{
		name: 'Exalted Relics',
		chance: 1.75 / 2000, // 1.75x from Scavenger
		conditions: [
			{
				check: 'conditions',
				op: 'not',
				property: 'rod',
				values: ['Rod Of The Exalted One']
			},
			{
				check: 'conditions',
				property: 'enchant',
				values: ['Scavenger']
			}
		],
		fish: ['Exalted Relic']
	},
	{
		name: 'Exalted Relics',
		chance: 1 / 800, // 2.5x from ROTEO
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Rod Of The Exalted One']
			},
			{
				check: 'conditions',
				op: 'not',
				property: 'enchant',
				values: ['Scavenger']
			}
		],
		fish: ['Exalted Relic']
	},
	{
		name: 'Exalted Relics',
		chance: 1.75 / 800, // 1.75x from Scavenger, 2.5x from ROTEO
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Rod Of The Exalted One']
			},
			{
				check: 'conditions',
				property: 'enchant',
				values: ['Scavenger']
			}
		],
		fish: ['Exalted Relic']
	},
	{
		name: 'Enchant Relics',
		chance: 1 / 350, // base chance
		fish: ['Enchant Relic'],
		conditions: [
			{
				check: 'conditions',
				op: 'not',
				property: 'enchant',
				values: ['Scavenger']
			}
		]
	},
	{
		name: 'Enchant Relics',
		chance: 3 / 350, // 3x from Scavenger
		fish: ['Enchant Relic'],
		conditions: [
			{
				check: 'conditions',
				property: 'enchant',
				values: ['Scavenger']
			}
		]
	},
]