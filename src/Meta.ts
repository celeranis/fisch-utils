import { getFile } from './DataParser.js';
import { GameDataMeta } from './types/Meta.js';

export const meta: GameDataMeta = await getFile('meta.json')
