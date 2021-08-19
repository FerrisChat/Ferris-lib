import { Client } from "../Client";

/**
 * The base class for all the models
 * @param id
 */
export default class Base {
    id: string;

    constructor(id: string) {

        this.id = id
    }

    _clone() {
        return Object.assign(Object.create(this), this);
    }

    _patch(data) {
        return data;
    }

    _update(data) {
        const clone = this._clone();
        this._patch(data);
        return clone;
    }
}