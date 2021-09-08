import { EventEmitter } from "events";
import { Client } from "../Client";
import { Events } from "../Constants";
import { StorageBox } from "../util/StorageBox";
import { Shard } from "./Shard";

/**
 * The class the Main client {@link Client} uses for interacting with the Gateway
 * @extends EventEmitter
 */
export class WebsocketManager extends EventEmitter {
    client: Client;
    gatewayUrl: string;
    shardQueue: Set<Shard>;
    shards: StorageBox<number, Shard>;

    constructor(client: Client) {
        super()

        this.client = client
        this.shardQueue = null
        this.shards = new StorageBox()
    }

    private async createShards() {

        if (!this.shardQueue.size) return

        const [shard] = this.shardQueue

        this.shardQueue.delete(shard)

        this.shards.set(shard.id, shard);
        this.debug(`Shard ${shard.id} Spawned`)

        try {
            await shard.connect()
        } catch (error) {
            this.debug(`Error Spawning Shard ${shard.id}...`)
            console.log(error)
            this.shards.delete(shard.id)
            this.shardQueue.add(shard)
        }

        if (this.shardQueue.size) {
            this.debug(`Shard Queue Size: ${this.shardQueue.size}; continuing in 5 seconds...`);
            await new Promise((r) => setTimeout((e) => r(e), 5000));
            return this.createShards();
        }

        this.debug("All Shards are Ready, Marking Client as ready.")
        this.client.emit(Events.READY)
    }

    debug(msg: string, shard?: Shard) {
        this.client.emit(Events.DEBUG, `[Ws => ${shard ? `Shard ${shard.id}` : 'Manager'}] ${msg}`)
    }

    async start() {
        this.debug("Fetching Gateway Url")
        const data = await this.client.getWsInfo()

        this.gatewayUrl = data.url

        this.debug(`Gateway Url: ${this.gatewayUrl}`)

        let shardlist = []

        if (this.client.options.shardCount === "auto" && this.client.options.shardList != "auto") {
            shardlist = this.client.options.shardList
        } else if (this.client.options.shardCount != "auto" && this.client.options.shardList === "auto") {
            this.client.options.shardList = shardlist = Array.from({ length: this.client.options.shardCount }, (_, i) => i)
        } else shardlist = this.client.options.shardList = Array.from({ length: 1 }, (_, i) => i)

        this.debug(`Spawning Shards:\n  Total: ${shardlist.length}\n  Shardlist: ${shardlist.join(", ")}`)

        this.shardQueue = new Set(shardlist.map(id => new Shard(this, id)))
        return this.createShards()
    }
}