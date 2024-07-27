import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { userCookieKey, cookieSep, createEncrypt } from 'libs/session'

// const CLIENT_ID = process.env.OAUTH_CLIENT_KEY
// const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req
  // const { searchParams } = nextUrl
  // const query = Object.fromEntries(searchParams)
  // const encrypt = createEncrypt()
  // const { code } = query

  // Bypass OAuth and set a dummy user token
  const token = 'dummyToken'
  
  const user = {
    name: token,
    encrypted: token, // No need for encryption in this dummy setup
  }

  // Remove OAuth logic and allow all requests
  // Comment out or remove the following block
  /*
  if (!code) {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&allow_signup=false`
    return NextResponse.redirect(redirectUrl)
  }

  try {
    const data = await (
      await fetch('https://github.com/login/oauth/access_token', {
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
    ).json()

    const accessToken = data.access_token

    if (accessToken) {
      const userInfo = await (
        await fetch('https://api.github.com/user', {
          method: 'GET',
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/json'
          }
        })
      ).json()

      token = userInfo.login
    }
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { message: err.toString() },
      {
        status: 500
      }
    )
  }

  if (!token) {
    return NextResponse.json(
      { message: 'Github authorization failed' },
      {
        status: 400
      }
    )
  }

  const user = {
    name: token,
    encrypted: await encrypt(token)
  }
  */

  // Allow the request to proceed without OAuth checks
  const url = req.nextUrl.clone()
  url.searchParams.delete('code')
  url.pathname = '/'

  const res = NextResponse.redirect(url);

  res.cookies.set(
    'dummy_user', 
    `${user.name}${user.encrypted}`,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    }
  )

  return res
}
