export class Embed {
	title?: string
	description?: string
	url?: string
	timestamp?: string
	author?: EmbedAuthor
	fields: Array<EmbedField>
	footer?: EmbedFooter

	constructor(data) {
		if ('title' in data) this.title = data.title
		if ('description' in data) this.description = data.description
		if ('url' in data) this.url = data.url
		if ('timestamp' in data) this.timestamp = data.timestamp
		if ('author' in data) this.author = data.author
		this.fields = data.fields
		if ('footer' in data) this.footer = data.footer
		return this
	}
}

export class EmbedCreator {
	title?: string
	description?: string
	url?: string
	timestamp?: string
	author?: EmbedAuthor
	fields: Array<EmbedField>
	footer?: EmbedFooter

	constructor() {
		this.title = null
		this.description = null
		this.url = null
		this.timestamp = null
		this.author = null
		this.fields = []
		this.footer = null
		return this
	}

	setTitle(str: string): this {
		this.title = str
		return this
	}

	setDescription(str: string): this {
		this.description = str
		return this
	}

	setUrl(url: string): this {
		this.url = url
		return this
	}

	setTimestamp(time: string): this {
		this.timestamp = time
		return this
	}

	setAuthor(author: EmbedAuthor): this {
		this.author = author
		return this
	}

	addField(field: EmbedField): this {
		this.fields.push(field)
		return this
	}

	setFooter(footer: EmbedFooter): this {
		this.footer = footer
		return this
	}
}

export interface EmbedAuthor {
	name: string
	icon_url: string
}

export interface EmbedField {
	name: string
	value: string
	inline: boolean
}

export interface EmbedFooter {
	text: string
	icon_url?: string
}
