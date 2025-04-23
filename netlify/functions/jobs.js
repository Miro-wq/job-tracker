require('dotenv').config()
const jwt = require('jsonwebtoken')
const { connectDB } = require('./utils/db')
const Job = require('./models/Job')

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  await connectDB()

  //autentificare JWT
  const auth = event.headers.authorization || event.headers.Authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Lipsește token-ul' }) }
  }
  let userId
  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    userId = decoded.userId
  } catch {
    return { statusCode: 401, body: JSON.stringify({ error: 'Token invalid' }) }
  }

  //dispatch dupa metoda
  switch (event.httpMethod) {
    case 'GET':
      try {
        const jobs = await Job.find({ userId }).sort('-createdAt')
        return {
          statusCode: 200,
          body: JSON.stringify(jobs)
        }
      } catch (err) {
        console.error(err)
        return { statusCode: 500, body: JSON.stringify({ error: 'Nu pot prelua joburile' }) }
      }

    case 'POST':
      try {
        const { title, company, url } = JSON.parse(event.body)
        const job = await Job.create({ userId, title, company, url })
        return {
          statusCode: 201,
          body: JSON.stringify(job)
        }
      } catch (err) {
        console.error(err)
        return { statusCode: 500, body: JSON.stringify({ error: 'Nu pot crea jobul' }) }
      }

    case 'PUT':
      try {
        const { id, status } = JSON.parse(event.body)
        const allowed = ['saved','applied','rejected','ghosted']
        if (!allowed.includes(status)) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Status invalid' }) }
        }
        const job = await Job.findOneAndUpdate(
          { _id: id, userId },
          { status },
          { new: true }
        )
        if (!job) {
          return { statusCode: 404, body: JSON.stringify({ error: 'Job nu există' }) }
        }
        return {
          statusCode: 200,
          body: JSON.stringify(job)
        }
      } catch (err) {
        console.error(err)
        return { statusCode: 500, body: JSON.stringify({ error: 'Nu pot actualiza jobul' }) }
      }

    default:
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }
}
