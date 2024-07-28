import { NextRequest, NextResponse } from 'next/server';
import { MongoDB } from '../../../libs/mongodb';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const uri = process.env.URI;
  if (!uri) {
    return NextResponse.json({ message: 'URI not in .env.local' }, { status: 500 });
  }
  const db = await MongoDB.getInstance(uri);
  await db.connect();
  const users = db.getCollection('users');
  const user = await users.findOne({ email: email });
  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 404 });
  }

  const checkPass = await bcrypt.compare(password, user.password);
  if (!checkPass) {
    return NextResponse.json({ error: 'Password is incorrect' }, { status: 401 });
  }
  return NextResponse.json({ message: 'Login successful' });
}
