import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDB } from '../../libs/mongodb'
import { validateUser } from '../../libs/schemas'
import { NextResponse } from 'next/server'

export async function POST(req) {
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
        return NextResponse.json({ error: validateUser.errors })
      }

      const newUser = req.body
      try {
        const result = await users.insertOne(newUser)
        NextResponse.json(newUser)
      } catch (error) {
        NextResponse.json({ message: 'User already exists' })
      }
    } catch (error) {
      NextResponse.json({ message: 'Error creating user' })
    }
  } catch (error) {
    NextResponse.json({ message: 'Error connecting to database' })
  }
}

export async function GET(req) {
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
    NextResponse.json({ message: 'Error connecting to database' })
  }
}
