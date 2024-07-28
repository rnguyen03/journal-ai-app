import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { userCookieKey, cookieSep, createEncrypt } from 'libs/session'

const CLIENT_ID = process.env.OAUTH_CLIENT_KEY
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req
  const { searchParams } = nextUrl
  const query = Object.fromEntries(searchParams)
  const encrypt = createEncrypt()
  const { code } = query

  console.log('Middleware invoked')
  console.log('Next URL:', nextUrl)
  console.log('Search Params:', searchParams)
  console.log('Query:', query)
  console.log('Code:', code)
  console.log('Client ID:', CLIENT_ID)
  console.log('Client Secret:', CLIENT_SECRET)

  // When there's no `code` param specified,
  // it's a GET from the client side.
  // We go with the login flow.
  if (!code) {
    console.log('No code found, initiating GitHub login flow')
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&allow_signup=false`
    console.log('Redirecting to:', redirectUrl)
    return NextResponse.redirect(redirectUrl)
  }

  let token = ''
  try {
    console.log('Fetching access token from GitHub')
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

    console.log('Access token response:', data)
    const accessToken = data.access_token

    // Let's also fetch the user info and store it in the session.
    if (accessToken) {
      console.log('Fetching user info from GitHub')
      const userInfo = await (
        await fetch('https://api.github.com/user', {
          method: 'GET',
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/json'
          }
        })
      ).json()

      console.log('User info response:', userInfo)
      token = userInfo.login
    }
  } catch (err) {
    console.error('Error during GitHub OAuth process:', err)

    return NextResponse.json(
      { message: err.toString() },
      {
        status: 500
      }
    )
  }

  if (!token) {
    console.log('No token found, GitHub authorization failed')
    return NextResponse.json(
      { message: 'Github authorization failed' },
      {
        status: 400
      }
    )
  }

  console.log('User token obtained:', token)
  const user = {
    name: token,
    encrypted: await encrypt(token)
  }

  const url = req.nextUrl.clone()
  url.searchParams.delete('code')
  url.pathname = '/'

  const res = NextResponse.redirect(url)

  console.log('Setting user cookie')
  res.cookies.set(
    userCookieKey,
    `${user.name}${cookieSep}${user.encrypted}; Secure; HttpOnly`
  )

  console.log('Redirecting to home page')
  return res
}
