import { NextRequest, NextResponse } from 'next/server'
import { MongoDB } from '../../../libs/mongodb'
import { validateUser } from '../../../libs/schemas'

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

    const { user, note } = await req.json()

    try {
      const result = await users.findOne({ userName: user })
      if (!result) {
        return NextResponse.json({ error: 'User not found' })
      }
      if (!result.notes) {
        result.notes = []
      }
      result.notes.push(note)
      await users.updateOne(
        { userName: user },
        { $set: { notes: result.notes } }
      )
      console.log(note)
      return NextResponse.json({ message: 'Note added successfully' })
    } catch (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
  } catch (error) {
    console.error(error)
  }
}
