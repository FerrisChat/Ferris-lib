import { Client } from "../Client";
import { SnowFlake } from "../Constants";

/**
 * The base class for all the models
 */
export default class Base {
    /**
 * The Id of the Model
 * @type {string}
 */
    Id: string;

    /**
     * @param {SnowFlake} id The Id of the model that extends this class
     */
    constructor(id: SnowFlake) {

        this.Id = id
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
        return data;
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