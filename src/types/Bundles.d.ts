/**
 * Types for "data/Bundles.json"
 */
export interface BundleReward_ShipLantern {
	Value: string
	Type: 'Ship' | 'Lantern'
}

export interface BundleReward_ServerLuck {
	Value: {
		Minutes: number
		Amount: number
	}
	Type: 'ServerLuckBoost'
}

export type BundleReward = BundleReward_ShipLantern | BundleReward_ServerLuck

export interface BundleData {
	FakePrice: string
	Rewards: BundleReward[]
	ProductId: number
}

export type BundlesLibrary = Record<string, BundleData>