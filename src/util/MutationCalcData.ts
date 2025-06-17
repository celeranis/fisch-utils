import { Bait } from '../Bait.js'
import { DEV_MUTATIONS, ZONE_DISPLAY } from '../Constants.js'
import { getFile } from '../DataParser.js'
import { MutationsLibrary } from '../types/Mutations.js'

export interface MutationCondition {
	check: 'conditions'//| 'fish'
	property: string
	op?: 'any' | 'not' | 'contains_any' | 'contains_none'
	values: (string | boolean | number)[]
}

export interface MutationDataEntry {
	mutation: string | string[]
	chance: number
	priority?: number
	chance_type: 'percent' | 'weight'
	allow_crates: boolean
	conditions?: MutationCondition[]
}

const enum MutationPriority {
	Default = 1,
	Rods = 40,
	Baits = 45,
	Enchants = 50,
	Conditions = 60,
	Nuke = 90,
	SpecialRods = 100,
	SpecialBaits = 95,
}

const InternalMutationDataMap = (await getFile('mutations.json') as MutationsLibrary).Mutations
const InternalMutationData = Object.values(InternalMutationDataMap)

export const MUTATION_DATA: MutationDataEntry[] = [
	// special baits
	...Bait.loadAll()
		.filter(bait => bait.mutation != undefined)
		.map((bait: Bait): MutationDataEntry => ({
			mutation: bait.mutation!,
			chance: bait.mutation_chance!,
			priority: MutationPriority.SpecialBaits,
			chance_type: 'percent',
			allow_crates: true,
			conditions: [
				{
					check: 'conditions',
					property: 'bait',
					values: [bait.name]
				}
			]
		})),
	// special rods
	{
		mutation: 'Celestial',
		chance: 100,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Celestial Rod']
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: [ 'Active' ]
			}
		]
	},
	{
		mutation: "King's Blessing",
		chance: 10,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Poseidon Rod"]
			}
		],
	},
	{
		mutation: "Tentacle Surge",
		chance: 5,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Kraken Rod"]
			}
		],
	},
	{
		mutation: 'Bloom',
		chance: 30,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Free Spirit Rod']
			}
		]
	},
	{
		mutation: ['Mother Nature', 'Green Leaf', 'Brown Wood'],
		chance: 100,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Verdant Shear Rod']
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: ['Active']
			}
		]
	},
	{
		mutation: 'Ember',
		chance: 20,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Blazebringer Rod']
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: ['Stage 2']
			}
		]
	},
	{
		mutation: 'Cracked',
		chance: 6.25, // adjusted for Ember
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Blazebringer Rod']
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: ['Stage 2']
			}
		]
	},
	{
		mutation: 'Ember',
		chance: 25,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Blazebringer Rod']
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: ['Stage 3']
			}
		]
	},
	{
		mutation: 'Cracked',
		chance: 13.333333, // adjusted for Ember
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Blazebringer Rod']
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: ['Stage 3']
			}
		]
	},
	{
		mutation: 'Emberflame',
		chance: 7.6923, // adjusted for Ember and Cracked
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Blazebringer Rod']
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: ['Stage 3']
			}
		]
	},
	// special pools
	{
		mutation: 'Nuclear',
		chance: 100,
		priority: MutationPriority.Nuke,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'otherConditions',
				op: 'contains_any',
				values: ['nuke']
			}
		]
	},
	{
		mutation: 'Doomsday',
		chance: 10,
		priority: MutationPriority.Nuke + 3,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'pool',
				values: ["Roslit Bay/Ashfall"]
			}
		],
	},
	{
		mutation: 'Electric Shock',
		chance: 90,
		priority: MutationPriority.SpecialRods + 1,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Zeus Rod']
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: [ 'Active' ]
			}
		]
	},
	{
		mutation: 'Charred',
		chance: 100,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Zeus Rod']
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: ['Active']
			}
		]
	},
	{
		mutation: 'Lightning',
		chance: 10,
		priority: MutationPriority.Conditions + 5,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'otherConditions',
				op: 'contains_any',
				values: ['zeus-zapped']
			},
			{
				check: 'conditions',
				property: 'pool',
				values: ["Atlantis/Zeus's Rod Room"]
			}
		]
	},
	{
		mutation: 'Wrath',
		chance: 2,
		priority: MutationPriority.Conditions + 4,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'otherConditions',
				op: 'contains_any',
				values: ['poseidons wrath']
			},
			{
				check: 'conditions',
				property: 'pool',
				values: ['Atlantis/Poseidon Temple']
			}
		]
	},
	{
		mutation: 'Electric',
		chance: 15,
		priority: MutationPriority.Conditions + 3,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'pool',
				values: ['Grand Reef']
			}
		]
	},
	{
		mutation: 'Sleet',
		chance: 10,
		priority: MutationPriority.Conditions + 2,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'otherConditions',
				op: 'contains_any',
				values: [ 'avalanche' ]
			}
		]
	},
	{
		mutation: 'Blighted',
		chance: 15,
		priority: MutationPriority.Conditions + 1,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'otherConditions',
				op: 'contains_any',
				values: [ 'blizzard' ]
			}
		]
	},
	{
		mutation: 'Solarblaze',
		chance: 10,
		priority: MutationPriority.Conditions,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'weather',
				values: [ 'Eclipse' ]
			}
		]
	},
	// enchants
	{
		mutation: 'Abyssal',
		chance: 10,
		priority: MutationPriority.Enchants,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'enchant',
				values: [ 'Abyssal' ]
			}
		]
	},
	{
		mutation: 'Translucent',
		chance: 100,
		priority: MutationPriority.Enchants,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'enchant',
				values: [ 'Ghastly' ]
			}
		]
	},
	{
		mutation: ['Albino', 'Darkened'],
		chance: 100,
		chance_type: 'percent',
		priority: MutationPriority.Enchants,
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'enchant',
				values: ['Noir']
			}
		]
	},
	{
		mutation: 'Subspace',
		chance: 25,
		chance_type: 'percent',
		priority: MutationPriority.Enchants,
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'enchant',
				values: ['Quantum']
			}
		]
	},
	{
		mutation: 'Purified',
		chance: 30,
		priority: MutationPriority.Enchants,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'enchant',
				values: ['Insight']
			}
		]
	},
	{
		mutation: 'Electric',
		chance: 50,
		priority: MutationPriority.Enchants,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'enchant',
				values: ['Storming']
			},
			{
				check: 'conditions',
				property: 'weather',
				values: ['Rain']
			}
		]
	},
	{
		mutation: 'Chaotic',
		chance: 8,
		priority: MutationPriority.Enchants,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'enchant',
				values: ['Chaotic']
			}
		]
	},
	// rods
	{
		mutation: 'Midas',
		chance: 100,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: [ 'Midas Rod' ]
			}
		]
	},
	{
		mutation: 'Atlantean',
		chance: 30,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Trident Rod']
			}
		]
	},
	{
		mutation: ['Aurous', 'Aurelian', 'Aureate', 'Aurulent', 'Aureolin'],
		chance: 100,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Auric Rod']
			}
		]
	},
	{
		mutation: 'Sunken',
		chance: 5,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Sunken Rod']
			}
		]
	},
	{
		mutation: 'Lunar',
		chance: 5,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Astral Rod']
			}
		]
	},
	{
		mutation: 'Greedy',
		chance: 60,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Rod Of The Eternal King']
			}
		]
	},
	{
		mutation: 'Jolly',
		chance: 25,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Antler Rod']
			}
		]
	},
	{
		mutation: 'Festive',
		chance: 10,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Candy Cane Rod']
			}
		]
	},
	{
		mutation: 'Scorched',
		chance: 40,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Phoenix Rod']
			}
		]
	},
	{
		mutation: 'Fossilized',
		chance: 35,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Voyager Rod']
			}
		]
	},
	{
		mutation: 'Hexed',
		chance: 50,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['No-Life Rod']
			}
		]
	},
	{
		mutation: 'Mythical',
		chance: 30,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Mythical Rod']
			}
		]
	},
	{
		mutation: 'Aurora',
		chance: 30,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Aurora Rod']
			},
			{
				check: 'conditions',
				property: 'weather',
				values: ['Aurora Borealis']
			}
		]
	},
	{
		mutation: 'Aurora',
		chance: 15,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Aurora Rod']
			},
			{
				check: 'conditions',
				property: 'weather',
				op: 'not',
				values: ['Aurora Borealis']
			}
		]
	},
	{
		mutation: ['Ghastly', 'Sinister'],
		chance: 20,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Haunted Rod']
			}
		]
	},
	{
		mutation: 'Studded',
		chance: 100,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Brick Rod']
			}
		]
	},
	{
		mutation: 'Prismize',
		chance: 50,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Ethereal Prism Rod"]
			}
		]
	},
	{
		mutation: 'Heavenly',
		chance: 35,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Heaven's Rod"]
			}
		],
	},
	{
		mutation: 'Crystalized',
		chance: 20,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Crystalized Rod"]
			}
		]
	},
	{
		mutation: 'Seasonal',
		chance: 50,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Seasons Rod']
			}
		]
	},
	{
		mutation: 'Firework',
		chance: 15,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Firework Rod']
			}
		]
	},
	{
		mutation: 'Ashen Fortune',
		chance: 20,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Volcanic Rod"]
			}
		]
	},
	{
		mutation: 'Ashen Fortune',
		chance: 5,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Magma Rod"]
			}
		]
	},
	{
		mutation: 'Negative',
		chance: 30,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Fungal Rod"]
			}
		]
	},
	{
		mutation: 'Frozen',
		chance: 100,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Arctic Rod"]
			}
		]
	},
	{
		mutation: 'Sleet',
		chance: 25,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Avalanche Rod"]
			}
		]
	},
	{
		mutation: 'Greedy',
		chance: 13,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Scurvy Rod"]
			}
		]
	},
	{
		mutation: 'Blighted',
		chance: 25,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Ice Warpers Rod"]
			}
		]
	},
	{
		mutation: 'Frozen',
		chance: 40,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Summit Rod"]
			}
		]
	},
	{
		mutation: 'Sleet',
		chance: 33.333333, //adjusted for Frozen
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Summit Rod"]
			}
		]
	},
	{
		mutation: 'Blighted',
		chance: 37.5, //adjusted for Frozen and Sleet
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Summit Rod"]
			}
		]
	},
	{
		mutation: 'Abyssal',
		chance: 25,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Abyssal Specter Rod"]
			}
		]
	},
	{
		mutation: 'Lost',
		chance: 36,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["The Lost Rod"]
			},
			{
				check: 'conditions',
				property: 'otherConditions',
				op: 'contains_any',
				values: ['perfect catch']
			}
		]
	},
	{
		mutation: 'Wrath',
		chance: 70,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Rod Of The Zenith"]
			}
		]
	},
	{
		mutation: 'Blessed',
		chance: 30,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Seraphic Rod"]
			}
		]
	},
	{
		mutation: "Blessed",
		chance: 100,
		priority: MutationPriority.Rods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Tryhard Rod"]
			}
		],
	},
	{
		mutation: "Easter",
		chance: 10,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Egg Rod"]
			}
		],
	},
	{
		mutation: "Awesome",
		chance: 5,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Brick Built Rod"]
			}
		],
	},
	{
		mutation: 'Solarblaze',
		chance: 10,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Fang of the Eclipse"]
			},
			{
				check: 'conditions',
				property: 'passiveState',
				op: 'not',
				values: ['Active']
			}
		]
	},
	{
		mutation: 'Solarblaze',
		chance: 90,
		priority: MutationPriority.SpecialRods + 1,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Fang of the Eclipse"]
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: ['Active']
			}
		]
	},
	{
		mutation: 'Umbra',
		chance: 100, // adjusted for solarblaze
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Fang of the Eclipse"]
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: ['Active']
			}
		]
	},
	{
		mutation: 'Astral',
		chance: 80,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Astralhook Rod"]
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: ['Active']
			}
		]
	},
	{
		mutation: 'Oscar',
		chance: 5,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Great Rod of Oscar"]
			}
		]
	},
	{
		mutation: 'Carrot',
		chance: 5,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Carrot Rod"]
			}
		]
	},
	{
		mutation: 'Carrot',
		chance: 100,
		priority: MutationPriority.SpecialRods + 1,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Carrot Rod"]
			},
			{
				check: 'conditions',
				property: 'passiveState',
				values: ['Active']
			}
		]
	},
	{
		mutation: 'Lobster',
		chance: 30,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ["Lobster Rod"]
			}
		]
	},
	{
		mutation: 'Gemstone',
		chance: 20,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Treasure Rod']
			}
		]
	},
	{
		mutation: 'Mother Nature',
		chance: 30,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Wildflower Rod']
			}
		]
	},
	{
		mutation: 'Glossy',
		chance: 100,
		priority: MutationPriority.SpecialRods,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'rod',
				values: ['Azure of Lagoon']
			}
		]
	},
	// bait
	{
		mutation: 'Aurora',
		chance: 30,
		priority: MutationPriority.Baits,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'bait',
				values: ['Aurora Bait']
			},
			{
				check: 'conditions',
				property: 'weather',
				values: ['Aurora Borealis']
			}
		]
	},
	{
		mutation: 'Aurora',
		chance: 15,
		priority: MutationPriority.Baits,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'bait',
				values: ['Aurora Bait']
			},
			{
				check: 'conditions',
				property: 'weather',
				op: 'not',
				values: ['Aurora Borealis']
			}
		]
	},
	{
		mutation: 'Jolly',
		chance: 20,
		priority: MutationPriority.Baits,
		chance_type: 'percent',
		allow_crates: false,
		conditions: [
			{
				check: 'conditions',
				property: 'bait',
				values: ['Holly Berry']
			}
		]
	},
	{
		mutation: 'Moon-Kissed',
		chance: 5,
		priority: -1000,
		chance_type: 'percent',
		allow_crates: true,
		conditions: [
			{
				check: 'conditions',
				property: 'otherConditions',
				op: 'contains_any',
				values: ["moon-kissed buff"]
			}
		],
	},
	// default
	...InternalMutationData
	.filter(mut => mut.Chance > 0 || mut.Display == 'Aurora')
	.map((mutation): MutationDataEntry => {
		const data: MutationDataEntry = {
			mutation: mutation.Display,
			chance: mutation.Chance,
			// priority: MutationPriority.Default,
			chance_type: 'weight',
			allow_crates: false,
			conditions: []
		}
		
		const zones = mutation.SpecificZones
			?.map(zone => ZONE_DISPLAY[zone] ?? zone)
			
		if (zones?.length) {
			data.conditions?.push({
				check: 'conditions',
				property: 'pool',
				values: zones
			})
		}
		
		if (mutation.Display == 'Lunar') {
			data.conditions?.push({
				check: 'conditions',
				property: 'otherConditions',
				op: 'contains_any',
				values: ['moonlit mirage']
			})
		// } else if (mutation.Display == 'Aurora') {
		// 	data.chance = 5
		// 	data.conditions?.push({
		// 		check: 'conditions',
		// 		property: 'weather',
		// 		values: ['Aurora Borealis']
		// 	})
		}
		
		return data
	})
]

export const MUTATION_MULTIPLIERS: Record<string, number> = {}
for (let [mutation, mutationData] of Object.entries(InternalMutationDataMap).sort(([k0], [k1]) => k0.localeCompare(k1))) {
	if (DEV_MUTATIONS.includes(mutation) || DEV_MUTATIONS.includes(mutationData.Display)) continue

	mutation = mutation.replaceAll("’", "'")
	mutationData.Display = mutationData.Display.replaceAll("’", "'")	
	
	MUTATION_MULTIPLIERS[mutation] = mutationData.PriceMultiply
	MUTATION_MULTIPLIERS[mutationData.Display] = mutationData.PriceMultiply
	
	// lazily preserving order
	if (mutationData.Display == 'Seasonal') {
		MUTATION_MULTIPLIERS['Seasonal (Spring)'] = 4.5
		MUTATION_MULTIPLIERS['Seasonal (Autumn)'] = 4
		MUTATION_MULTIPLIERS['Seasonal (Winter)'] = 2.5
	}
}
MUTATION_MULTIPLIERS.Abyssal = 3.5 // shrug
MUTATION_MULTIPLIERS.Albino = 1.5