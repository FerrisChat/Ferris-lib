import { Client } from "../Client";

/**
 * The base class for all the models
 * @param {string} id of the Model
 */
export default class Base {
    Id: string;

    constructor(id: string) {

        /**
         * The Id of the Model
         * @type {string}
         */
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