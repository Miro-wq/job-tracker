require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { connectDB } = require('./utils/db')
const User = require('./models/User')

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  await connectDB()

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  try {
    const { email, password } = JSON.parse(event.body)
    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email și parolă necesare' }) }
    }

    const user = await User.findOne({ email })
    if (!user) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Credențiale invalide' }) }
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Credențiale invalide' }) }
    }

    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ token })
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Eroare la autentificare' }) }
  }
}
