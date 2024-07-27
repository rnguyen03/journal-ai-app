import { MongoDB } from '../../libs/mongodb'

export default async function handler(req, response) {
  try {
    const db = MongoDB.getInstance(process.env.URI)
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
