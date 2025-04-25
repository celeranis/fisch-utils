import { readFile, writeFile } from 'fs/promises';

const input = (await readFile('./badtemplate.wikitext')).toString()

const output = input
	.replaceAll(/^(\s*)([<{\[])/gm, '$1-->$2')
	.replaceAll(/([>}|\]])\s*?$/gm, '$1<!--')
	
await writeFile('./newtemplate.wikitext', output)