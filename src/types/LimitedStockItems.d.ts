/**
 * Types for "data/LimitedStockItems.json"
 */

export interface LimitedStockItem {
	InitialStock: number
}

export type LimitedStockItemsLibrary = Record<string, LimitedStockItem>