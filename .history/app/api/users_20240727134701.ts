import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDB } from '../../libs/mongodb'
import { validateUser } from '../../libs/schemas'
import { NextResponse } from 'next/server'

export async function POST(req: NextApiRequest, response: NextApiResponse) {
  const uri = process.env.URI

  if (!uri) {
    throw new Error('Missing Mongo URI in .env.local')
  }
  try {
    const db = MongoDB.getInstance(uri)
    await db.connect()
    const users = db.getCollection('users')
    try {
      const valid = validateUser(req.body)
      if (!valid) {
        return response.status(404).json({ error: validateUser.errors })
      }

      const newUser = req.body
      try {
        const result = await users.insertOne(newUser)
        response.status(201).json(newUser)
      } catch (error) {
        response.status(400).json({ message: 'User already exists' })
      }
    } catch (error) {
      response.status(400).json({ message: 'Error creating user' })
    }
  } catch (error) {
    response.status(500).json({ message: 'Error connecting to database' })
  }
}

export async function GET(req: NextApiRequest, response: NextApiResponse) {
  const uri = process.env.URI

  if (!uri) {
    throw new Error('Missing Mongo URI in .env.local')
  }
  try {
    const db = MongoDB.getInstance(uri)
    await db.connect()
    const users = db.getCollection('users')

    const user = req.body
    try {
      const result = await users.findOne(user)
      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json({ error: 'User not found' })
    }
  } catch (error) {
    response.status(500).json({ message: 'Error connecting to database' })
  }
}
