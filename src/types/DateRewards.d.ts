export interface DateRewardEntry {
	Value: string
	Type: 'Lantern' | 'Bobber' | 'Emote' | 'Bait' | 'Rod' | 'Boat'
	DisplayText?: string
	Argument?: number
	Note?: string
}

export interface DateRewards {
	StartingDate: Date
	Current: string
	Name: string
	Rewards: DateRewardEntry[]
}