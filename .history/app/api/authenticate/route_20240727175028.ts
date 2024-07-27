import { NextRequest, NextResponse } from 'next/server';
import { MongoDB } from '../../../libs/mongodb';
import { validateUser } from '../../../libs/schemas';

export async function POST(req: NextRequest) {
    const uri = process.env.URI;
  
    if (!uri) {
      return NextResponse.json({ error: 'Missing Mongo URI in .env.local' }, { status: 500 });
    }
  
    try {
      const db = MongoDB.getInstance(uri);
      await db.connect();
      const users = db.getCollection('users');
  
      const {email, password} = await req.json();
      try{
        const user = await users.findOne({email: email})
        if(!user){
            return NextResponse.json({error: 'User not found'}, {status: 404})
        }
        if(user.password !== password){
            return NextResponse.json({error: 'Invalid password'}, {status: 401})
        }
        return NextResponse.json({message: 'User authenticated successfully'}, {status: 200})
      } catch(error){
        return NextResponse.json({error: 'Error authenticating user'}, {status: 500})
      }
  } catch(error){
    return NextResponse.json({error: 'Error connecting to db'}, {status: 500})
  }
}