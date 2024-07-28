import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

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

const userSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    notes: {
      type: 'array',
      items: noteSchema
    }
  },
  required: ['email', 'password'],
  additionalProperties: false
}

const validateUser = ajv.compile(userSchema)

export { validateUser }
