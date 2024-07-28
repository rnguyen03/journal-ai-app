import { NextRequest, NextResponse } from 'next/server'
import { MongoDB } from '../../../libs/mongodb'
import { validateUser } from '../../../libs/schemas'
import bcrypt from 'bcrypt'
export async function GET(req: NextRequest) {
  const uri = process.env.URI

  if (!uri) {
    return NextResponse.json(
      { error: 'Missing Mongo URI in .env.local' },
      { status: 500 }
    )
  }

  try {
    const db = MongoDB.getInstance(uri)
    await db.connect()
    const users = db.getCollection('users')

    const { searchParams } = new URL(req.url)
    const user = Object.fromEntries(searchParams.entries())
    try {
      const result = await users.findOne(user)
      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to connect to db', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const uri = process.env.URI

  if (!uri) {
    return NextResponse.json(
      { error: 'Missing Mongo URI in .env.local' },
      { status: 500 }
    )
  }

  try {
    const db = MongoDB.getInstance(uri)
    await db.connect()
    const users = db.getCollection('users')

    const { email, password } = await req.json()
    
    const valid = validateUser({ email, password })
    if (!valid) {
      return NextResponse.json({ error: validateUser.errors }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { email, password: hashedPassword }

    try {
      const result = await users.insertOne(newUser)
      return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Failed to connect to db', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

