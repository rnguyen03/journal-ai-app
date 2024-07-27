// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
import Ajv from 'ajv'

let cachedClient: MongoClient | null = null

async function connectToDatabase() {
  const uri = process.env.URI

  if (!uri) {
    throw new Error('Missing Mongo URI in .env.local')
  }
  if (cachedClient) {
    return cachedClient
  }
  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  return client
}

const ajv = new Ajv()

const userSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' }
  },
  required: ['name', 'email'],
  additionalProperties: false
}

const validateUser = ajv.compile(userSchema)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await connectToDatabase()
    const db = client.db('your-database-name')
    const usersCollection = db.collection('users')

    switch (req.method) {
      case 'GET':
        const user = req.query
        try {
          const result = await usersCollection.findOne(user)
          if (!result) {
            return res.status(404).json({ error: 'User not found' })
          }
          return res.status(200).json(result)
        } catch (error) {
          return res.status(500).json({ error: 'Error fetching user' })
        }

      case 'POST':
        try {
          const isValid = validateUser(req.body)
          if (!isValid) {
            return res.status(400).json({ error: validateUser.errors })
          }

          const newUser = req.body
          try {
            const result = await usersCollection.insertOne(newUser)
            return res.status(201).json(result)
          } catch (error) {
            return res
              .status(400)
              .json({ message: 'User already exists or error creating user' })
          }
        } catch (error) {
          return res.status(400).json({ message: 'Error creating user' })
        }

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Failed to connect to db', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
