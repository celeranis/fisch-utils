export function whitespace(string: string, targetWhitespace: number = 13) {
	return string + ' '.repeat(targetWhitespace - string.length)
}

export function andList(list: string[]) {
	if (list.length < 3) {
		return list.join(' and ')
	} else {
		return list.slice(0, -1).join(', ') + ', and ' + list[list.length - 1]
	}
}

export function pageInfoHeader(title: string) {
	return `<%-- [PAGE_INFO]\nPageTitle=#${title}#\n[END_PAGE_INFO] --%>`
}

export function uploadPrompt(filePath: string, destinationName: string, categories: string) {
	if (!filePath) return ''
	if (!destinationName) {
		throw new TypeError(`Failed to generate upload prompt: destination name is empty or missing!`)
	}
	if (!categories) {
		throw new TypeError(`Failed to generate upload prompt: categories are empty or missing!`)
	}
	
	return `{{subst:void|<!--$UPLOAD:<<${filePath}>-<${destinationName}>-<${categories}>>-->}}`
}

export function roundTo(num: number, factor: number) {
	return Math.round(num * Math.pow(10, factor)) / Math.pow(10, factor)
}

export function zeroPad(number: number, length: number) {
	const stringNum = Math.abs(number).toString()
	return (number < 0 ? '-' : '') + '0'.repeat(Math.max(length - stringNum.length, 0)) + stringNum
}

export const PAGENAME = '{{subst:#titleparts:{{subst:PAGENAME}}}}'
export const BASEPAGENAME = '{{subst:#titleparts:{{subst:BASEPAGENAME}}}}'

export function a(text?: string) {
	return text?.match(/^[aeiou]/i) ? 'an' : 'a'
}