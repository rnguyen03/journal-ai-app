import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

const userSchema = {
  type: 'object',
  properties: {
    userName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    age: { type: 'integer', minimum: 0 }
  },
  required: ['userName', 'email'],
  additionalProperties: false
}

const validateUser = ajv.compile(userSchema)

export { validateUser }
