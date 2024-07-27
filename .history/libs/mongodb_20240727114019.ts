import { MongoClient } from 'mongodb'
import type { Collection } from 'mongodb'
const uri = process.env.URI

export class MongoDB {
  private static instance: MongoDB
  private client: MongoClient

  private constructor(uri: string) {
    this.client = new MongoClient(uri)
  }

  public static getInstance(uri: string): MongoDB {
    if (!MongoDB.instance) MongoDB.instance = new MongoDB(uri)

    return MongoDB.instance
  }

  public async connect(): Promise<void> {
    try {
      await this.client.db().command({ ping: 1 })
    } catch (error) {
      await this.client.connect()
    }
  }

  public getClient(): MongoClient {
    return this.client
  }

  public getCollection(name: string): Collection {
    return this.client.db().collection(name)
  }
}
