import { Constants } from '..'
import { BitField } from './Bitfield'

export class UserFlags extends BitField {
	constructor(bits: number) {
		super(bits, Constants.UserFlags)
	}
}
