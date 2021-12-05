import { ModelCacheOptions } from './Constants'

/**
 * A cache that holds data
 * @param Limit
 * @param sweepInterval
 * @param sweepFilter
 * @extends Map
 */
export class StorageBox<K, V> extends Map<K, V> {
	public limit: number
	sweepInterval: number
	sweepFilter: (v: V) => boolean

	constructor(options?: ModelCacheOptions<V> | boolean) {
		super()

		if (options && typeof options === 'object') {
			this.limit = options.limit
			this.sweepInterval = options.sweepInterval || null
			this.sweepFilter = options.sweepFilter || null
			if (this.sweepInterval) this.sweep()
		} else if (options && typeof options === 'boolean') {
			if (options) this.limit = Infinity
			else this.limit = 0
		} else {
			this.limit = 0
		}
	}

	/**
	 * Filters out items from the Cache that matches the function
	 * @param func
	 * @returns An Array of the filtered items
	 */
	public filter(func: (item: V) => boolean): V[] {
		const arr = []
		for (const item of this.values()) {
			if (func(item)) {
				arr.push(item)
			}
		}
		return arr
	}

	/**
	 * Find something from the cache
	 * @param func
	 * @returns
	 */
	public find(func: (item: V) => boolean) {
		for (const item of this.values()) {
			if (func(item)) {
				return item
			}
		}
		return undefined
	}

	/**
	 * @returns The first value of the cache
	 */
	public first(): V | V[] {
		for (const item of this.values()) {
			return item
		}
	}

	/**
	 * @returns All values in an Array
	 */
	public getAll() {
		return Array.from(this.values())
	}

	/**
	 * @returns A random Value
	 */
	public random(): V | undefined {
		return this.size
			? Array.from(this.values())[Math.floor(Math.random() * this.size)]
			: undefined
	}

	/**
	 * Maps all The Data in an Array
	 * @param func
	 * @returns An Array
	 */
	public map(func: (item: V) => boolean) {
		const arr = []
		for (const item of this.values()) {
			arr.push(func(item))
		}
		return arr
	}

	public set(key: K, value: V): this {
		if (this.limit === 0) return this
		else if (this.size >= this.limit) return this
		return super.set(key, value)
	}

	public some(func: (item: V) => boolean) {
		for (const item of this.values()) {
			if (func(item)) {
				return true
			}
		}
		return false
	}

	private sweep() {
		setInterval(() => {
			this.forEach((value, key) => {
				if (this.sweepFilter && this.sweepFilter(value))
					this.delete(key)
				else this.clear()
			})
		}, this.sweepInterval)
	}
}
