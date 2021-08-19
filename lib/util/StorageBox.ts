/**
 * A cache that holds data
 * @param Limit
 * @extends Map
 */
export class StorageBox<K, V> extends Map<K, V> {
    public limit: number;
    constructor(limit: number = 1000) {
        super();

        this.limit = limit
    }

    public filter(func: (item: V) => boolean) {
        const arr = [];
        for (const item of this.values()) {
            if (func(item)) {
                arr.push(item);
            }
        }
        return arr;
    }

    public find(func: (item: V) => boolean) {
        for (const item of this.values()) {
            if (func(item)) {
                return item;
            }
        }
        return undefined;
    }

    public first(): V | V[] {
        for (const item of this.values()) {
            return item
        }
    }

    public getAll() {
        return Array.from(this.values())
    }

    public random(): V | undefined {
        return this.size ? Array.from(this.values())[Math.floor(Math.random() * this.size)] : undefined
    }

    public map(func: (item: V) => boolean) {
        const arr = [];
        for (const item of this.values()) {
            arr.push(func(item));
        }
        return arr;
    }

    public set(key: K, value: V): this {
        if (this.limit === 0) return this
        else if (this.size >= this.limit) return this
        return super.set(key, value);
    }

    public some(func: (item: V) => boolean) {
        for (const item of this.values()) {
            if (func(item)) {
                return true;
            }
        }
        return false;
    }
}