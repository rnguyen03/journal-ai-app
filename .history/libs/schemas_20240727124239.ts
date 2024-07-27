const Ajv = require('ajv')
const ajv = new Ajv()

const user = {
  userName: { type: 'string' },
  password: { type: 'string' }
}

const validateUser = ajv.compile(user)

module.exports = { validateUser }
