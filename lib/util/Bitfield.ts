export class BitField {
	#defaultBit: number
	bitfield: number
	#FLAGS: any
	/**
	 * @param {BitFieldResolvable} [bits=this.constructor.defaultBit] Bit(s) to read from
	 */
	constructor(bits = 0, flags: any) {
		this.#defaultBit = 0

		/**
		 * Bitfield of the packed bits
		 * @type {number|bigint}
		 */
		this.bitfield = this.resolve(bits)
		this.#FLAGS = flags
	}

	/**
	 * Checks whether the bitfield has a bit, or any of multiple bits.
	 * @param {BitFieldResolvable} bit Bit(s) to check for
	 * @returns {boolean}
	 */
	any(bit) {
		return (this.bitfield & this.resolve(bit)) !== this.#defaultBit
	}

	/**
	 * Checks if this bitfield equals another
	 * @param {BitFieldResolvable} bit Bit(s) to check for
	 * @returns {boolean}
	 */
	equals(bit) {
		return this.bitfield === this.resolve(bit)
	}

	/**
	 * Checks whether the bitfield has a bit, or multiple bits.
	 * @param {BitFieldResolvable} bit Bit(s) to check for
	 * @returns {boolean}
	 */
	has(bit) {
		bit = this.resolve(bit)
		return (this.bitfield & bit) === bit
	}

	/**
	 * Gets all given bits that are missing from the bitfield.
	 * @param {BitFieldResolvable} bits Bit(s) to check for
	 * @param {...*} hasParams Additional parameters for the has method, if any
	 * @returns {string[]}
	 */
	missing(bits, ...hasParams) {
		return new BitField(bits, this.#FLAGS)
			.remove(this)
			.toArray(...hasParams)
	}

	/**
	 * Freezes these bits, making them immutable.
	 * @returns {Readonly<BitField>}
	 */
	freeze() {
		return Object.freeze(this)
	}

	/**
	 * Adds bits to these ones.
	 * @param {...BitFieldResolvable} [bits] Bits to add
	 * @returns {BitField} These bits or new BitField if the instance is frozen.
	 */
	add(...bits: any) {
		let total = this.#defaultBit
		for (const bit of bits) {
			total |= this.resolve(bit)
		}
		if (Object.isFrozen(this))
			return new BitField(this.bitfield | total, this.#FLAGS)
		this.bitfield |= total
		return this
	}

	/**
	 * Removes bits from these.
	 * @param {...BitFieldResolvable} [bits] Bits to remove
	 * @returns {BitField} These bits or new BitField if the instance is frozen.
	 */
	remove(...bits) {
		let total = this.#defaultBit
		for (const bit of bits) {
			total |= this.resolve(bit)
		}
		if (Object.isFrozen(this))
			return new BitField(this.bitfield & ~total, this.#FLAGS)
		this.bitfield &= ~total
		return this
	}

	/**
	 * Gets an object mapping field names to a {@link boolean} indicating whether the
	 * bit is available.
	 * @param {...*} hasParams Additional parameters for the has method, if any
	 * @returns {Object}
	 */
	serialize(...hasParams: any) {
		const serialized = {}
		for (const [flag, bit] of Object.entries(this.#FLAGS)) {
			// @ts-expect-error
			serialized[flag] = this.has(bit, ...hasParams)
		}
		return serialized
	}

	/**
	 * Gets an {@link Array} of bitfield names based on the bits available.
	 * @param {...*} hasParams Additional parameters for the has method, if any
	 * @returns {string[]}
	 */
	toArray(...hasParams) {
		return Object.keys(this.#FLAGS).filter((bit) => {
			// @ts-expect-error
			this.has(bit, ...hasParams)
		})
	}

	toJSON() {
		return this.bitfield
	}

	valueOf() {
		return this.bitfield
	}

	*[Symbol.iterator]() {
		yield* this.toArray()
	}

	/**
	 * Data that can be resolved to give a bitfield. This can be:
	 * * A bit number (this can be a number literal or a value taken from {@link BitField.FLAGS})
	 * * A string bit number
	 * * An instance of BitField
	 * * An Array of BitFieldResolvable
	 * @typedef {number|string|bigint|BitField|BitFieldResolvable[]} BitFieldResolvable
	 */

	resolve(bit): number {
		if (typeof this.#defaultBit === typeof bit && bit >= this.#defaultBit)
			return bit
		if (bit instanceof BitField) return bit.bitfield
		if (Array.isArray(bit))
			return bit
				.map((p) => this.resolve(p))
				.reduce((prev, p) => prev | p, this.#defaultBit)
		if (typeof bit === 'string') {
			if (typeof this.#FLAGS[bit] !== 'undefined') return this.#FLAGS[bit]
			// @ts-expect-error
			if (!isNaN(bit)) return Number(bit)
		}
	}
}
