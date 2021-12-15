const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)
export class Util {
	/**
	 * Sets default properties on an object that aren't already specified.
	 * @param {Object} def Default properties
	 * @param {Object} given Object to assign defaults to
	 * @returns {Object}
	 * @private
	 */
	static mergeDefault<T>(def: any, given: T): T {
		if (!given) return def
		for (const key in def) {
			if (!has(given, key) || given[key] === undefined) {
				given[key] = def[key]
			} else if (given[key] === Object(given[key])) {
				given[key] = this.mergeDefault(def[key], given[key])
			}
		}
		return given
	}
}
