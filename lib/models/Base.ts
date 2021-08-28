import { Client } from "../Client";
import { FERRIS_EPOCH, SnowFlake } from "../Constants";

/**
 * The base class for all the models
 */
export class Base {
    /**
 * The Id of the Model
 * @type {SnowFlake }
 */
    id: SnowFlake;

    /**
     * @param {SnowFlake} id The Id of the model that extends this class
     */
    constructor(id: SnowFlake) {

        this.id = BigInt(id).toString()
    }

    get createdAt(): number {
        return Math.floor(((Number(this.id) >> 64) + FERRIS_EPOCH))
    }

    get UTCcreatedAt(): string {
        return new Date(this.createdAt).toUTCString()
    }

    /**
     * Clones the Model
     * @returns A clone of the Model
     */
    _clone() {
        return Object.assign(Object.create(this), this);
    }

    /**
     * Updates the model data
     * @param {any} data 
     * @returns The updated Data
     */
    _patch(data) {
        return this;
    }

    /**
     * Updates the Moedl data
     * @param {any} data 
     * @returns The old data of the model
     */
    _update(data) {
        const clone = this._clone();
        this._patch(data);
        return clone;
    }
}