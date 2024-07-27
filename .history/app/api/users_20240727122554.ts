import { MongoDB } from '../../libs/mongodb'

export default async function handler(req, response) {
  const uri = process.env.URI

  if (!uri) {
    throw new Error('Missing Mongo URI in .env.local')
  }
  try {
    const db = MongoDB.getInstance(uri)
    await db.connect()
    const users = db.getCollection('users')

    switch (req.method) {
      case 'GET':
        const user = req.body
        try {
          const result = await users.findOne(user)
          response.status(200).json(user)
        } catch (error) {
          response.status(404).json({ message: 'User not found' })
        }
    }
  } catch (error) {
    console.error('Failed to connect to db', error)
  }
}
