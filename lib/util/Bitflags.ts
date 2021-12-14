import { Constants } from '..'

export class Bitflags {
	bit: number
	#flags: any

	constructor(bit: number = 0, flags: any) {
		this.bit = bit
		this.#flags = flags
	}

	any(bit) {
		return (this.bit & this.resolve(bit)) !== 0
	}

	equals(bit): boolean {
		return this.bit === this.resolve(bit)
	}

	has(bit: string | number): boolean {
		bit = this.resolve(bit)
		return (this.bit & bit) === bit
	}

	serialize() {
		const serialized = {}
		for (const [flag, bit] of Object.entries(this.#flags)) {
			serialized[flag] = this.has(bit as number)
		}
		return serialized
	}

	toArray() {
		return Object.keys(this.#flags).filter((bit) => this.has(bit))
	}

	toJSON() {
		return this.bit
	}

	valueOf() {
		return this.bit
	}

	resolve(value: string | number): number {
		if (typeof value === 'string') return this.#flags[value]
		else if (typeof value === 'number') return value
	}
}

export class GuildFlags extends Bitflags {
	constructor(bit: number) {
		super(bit, Constants.GuildFlags)
	}
}

export class UserFlags extends Bitflags {
	constructor(bit: number) {
		super(bit, Constants.UserFlags)
	}
}
