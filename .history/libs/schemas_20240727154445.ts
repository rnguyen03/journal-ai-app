import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

const userSchema = {
  type: 'object',
  properties: {
    userName: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['userName', 'email', 'password'],
  additionalProperties: false
}

const noteSchema = {
  type: 'object',
  properties: {
    Note_ID: { type: 'string' },
    title: { type: 'string' },
    content: { type: 'string' },
    summary: { type: 'string' },
    date: { type: 'string' }
  }
}

const validateUser = ajv.compile(userSchema)

export { validateUser }
