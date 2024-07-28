import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { userCookieKey, cookieSep, createEncrypt } from 'libs/session'
import { MongoDB } from 'libs/mongodb'

const CLIENT_ID = process.env.OAUTH_CLIENT_KEY
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET

interface userObj {
  login: string;
  email: string;
}
export default async function middleware(req: NextRequest) {
  const { nextUrl } = req
  const { searchParams } = nextUrl
  const query = Object.fromEntries(searchParams)
  const encrypt = createEncrypt()
  const { code } = query

  console.log('CLIENT_ID:', CLIENT_ID)
  console.log('CLIENT_SECRET:', CLIENT_SECRET)
  console.log('OAuth Code:', code)

  if (!code) {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&allow_signup=false`
    console.log('Redirecting to:', redirectUrl)
    return NextResponse.redirect(redirectUrl)
  }

  let token = ''
  let userInfo: userObj | null = null
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    const data = await tokenResponse.json()
    console.log('Access Token Response:', data)

    const accessToken = data.access_token

    if (accessToken) {
      const userResponse = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/json'
        }
      })

      userInfo = await userResponse.json() as userObj
      console.log('User Info Response:', userInfo)

      token = userInfo.login
    }
  } catch (err) {
    console.error('Error during OAuth process:', err)
    return NextResponse.json(
      { message: err.toString() },
      { status: 500 }
    )
  }

  if (!token) {
    console.log('GitHub authorization failed')
    return NextResponse.json(
      { message: 'GitHub authorization failed' },
      { status: 400 }
    )
  }
  const uri = process.env.URI
  if(!uri){
    return NextResponse.json({error: "Missing Mongo URI in .env.local"});
  }

  try{
    const db = MongoDB.getInstance(uri)
    await db.connect()
    const users = db.getCollection('users')

    const existingUser = await users.findOne({ email: userInfo!.email})

    if(!existingUser){
      const user = {
        email: userInfo!.email || '',
        password: ''
    }
    try{
      const result = await users.insertOne(user)
      console.log('user created', result);
    } catch(error){
      console.error('Error creating user:', error)
      return NextResponse.json({error: 'Error creating user'}, {status: 500})
    }
  }} catch (error){
    console.error('failed to connect to db', error);
  }
  const user = {
    name: token,
    encrypted: await encrypt(token)
  }

  console.log('User:', user)

  // Allow the request to proceed without OAuth checks
  const url = req.nextUrl.clone()
  url.searchParams.delete('code')
  url.pathname = '/'

  const res = NextResponse.next()

  res.cookies.set(
    'dummy_user',
    `${user.name}${user.encrypted}; Secure; HttpOnly`
  )

  return res
}
