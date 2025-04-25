export interface JSONVector {
	$type: 'Vector3'
	X: number
	Y: number
	Z: number
}

export class Vector {
	constructor(public x: number, public y: number, public z: number) {}
	
	static fromJSON({ X, Y, Z }: JSONVector) {
		return new this(X, Y, Z)
	}
	
	toJSON(): JSONVector {
		return {
			$type: 'Vector3',
			X: this.x,
			Y: this.y,
			Z: this.z,
		}
	}
	
	toArray() {
		return [this.x, this.y, this.z]
	}
	
	toString() {
		return `(${this.x}, ${this.y}, ${this.z})`
	}
	
	toCoordinates() {
		return `{{Coordinates|${Math.round(this.x)}|${Math.round(this.y)}|${Math.round(this.z)}}}`
	}
	
	round() {
		this.x = Math.round(this.x)
		this.y = Math.round(this.y)
		this.z = Math.round(this.z)
		return this
	}
	
	compareTo(other: Vector) {
		if (!other) return 1
		
		if (this.x != other.x) {
			return this.x > other.x ? 1 : -1
		}
		
		if (this.y != other.y) {
			return this.y > other.y ? 1 : -1
		}
		
		if (this.z != other.z) {
			return this.z > other.z ? 1 : -1
		}
		
		return 0
	}
}