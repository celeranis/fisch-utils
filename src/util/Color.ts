import { roundTo } from './General.js'

export interface JSONColor {
	$type: 'Color3'
	R: number
	G: number
	B: number
}

export interface JSONColorKeypoint {
	time: number
	value: JSONColor
}

export interface JSONColorSequence {
	$type: 'ColorSequence'
	keypoints: JSONColorKeypoint[]
}

export interface ColorKeypoint {
	time: number
	value: Color
}

// https://stackoverflow.com/a/5624139
function componentToHex(c: number) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

export class Color {
	constructor(public r: number, public g: number, public b: number) {}
	
	static fromJSON({ R, G, B }: JSONColor) {
		return new this(R, G, B)
	}
	
	static fromHex(hex: string) {
		if (hex.startsWith('#')) {
			hex = hex.substring(1)
		}
		const r = Number.parseInt(hex.substring(0, 2), 16)
		const g = Number.parseInt(hex.substring(2, 4), 16)
		const b = Number.parseInt(hex.substring(4, 6), 16)
		return new Color(r, g, b)
	}
	
	toJSON(): JSONColor {
		return {
			$type: 'Color3',
			R: this.r,
			G: this.g,
			B: this.b,
		}
	}
	
	toHex(): string {
		return componentToHex(this.r) + componentToHex(this.g) + componentToHex(this.b);
	}
	
	toRGBVar(divide: number = 1): string {
		return `${Math.round(this.r / divide)} ${Math.round(this.g / divide)} ${Math.round(this.b / divide)}`
	}
}

export class ColorSequence {
	keypoints: ColorKeypoint[]
	
	constructor(keypoints: JSONColorKeypoint[]) {
		this.keypoints = keypoints
			.map(color => ({ time: color.time, value: Color.fromJSON(color.value) }))
			.sort((t0, t1) => t0.time - t1.time)
	}

	static fromJSON({ keypoints }: JSONColorSequence) {
		return new this(keypoints)
	}
	
	toCSSGradient(rotation: number = 0) {
		return `linear-gradient(${rotation}deg, ${this.keypoints.map(keypoint => `#${keypoint.value.toHex()} ${roundTo(keypoint.time * 100, 2)}%`).join(', ')})`
	}
	
	toJSON(): JSONColorSequence {
		return {
			$type: 'ColorSequence',
			keypoints: this.keypoints.map(keypoint => ({ time: keypoint.time, value: keypoint.value.toJSON() }))
		}
	}
}