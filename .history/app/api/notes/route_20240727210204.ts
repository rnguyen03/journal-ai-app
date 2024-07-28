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
      const result = await users.findOne({ userName: user.userName })

      if (result === null) {
        return NextResponse.json({ error: 'User not found' })
      }
      if (!result.notes) {
        result.notes = []
      }
      result.notes.push(note)
      console.log(result.notes)

      await users.updateOne(
        { userName: user.userName },
        { $set: { notes: result.notes } }
      )

      return NextResponse.json({ message: 'Note added successfully' })
    } catch (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
  } catch (error) {
    console.error(error)
  }
}

export async function GET(req: NextRequest) {
  const uri = process.env.URI;
  if (!uri) {
    return NextResponse.json(
      { error: 'Missing Mongo URI in .env.local' },
      { status: 500 }
    );
  }

  try {
    const db = MongoDB.getInstance(uri);
    await db.connect();
    const users = db.getCollection('users');
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get('userName');
    
    if (!userName) {
      return NextResponse.json({ error: 'Missing username query parameter' }, { status: 400 });
    }

    const result = await users.findOne({ userName });
    if (result === null) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ notes: result.notes });
  } catch (error) {
    console.error('Error fetching user notes:', error);
  }
}
