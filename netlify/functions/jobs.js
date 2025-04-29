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
    return { statusCode: 401, body: JSON.stringify({ error: 'Token missing' }) }
  }
  let userId
  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    userId = decoded.userId
  } catch {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) }
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
        return { statusCode: 500, body: JSON.stringify({ error: 'Unable to fetch jobs' }) }
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
        return { statusCode: 500, body: JSON.stringify({ error: 'Unable to create job' }) }
      }

    case 'PUT':
      try {
        const { id, status } = JSON.parse(event.body)
        const allowed = ['saved', 'applied', 'rejected', 'ghosted']
        if (!allowed.includes(status)) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Invalid status' }) }
        }
        const job = await Job.findOneAndUpdate(
          { _id: id, userId },
          { status },
          { new: true }
        )
        if (!job) {
          return { statusCode: 404, body: JSON.stringify({ error: 'Job not found' }) }
        }
        return {
          statusCode: 200,
          body: JSON.stringify(job)
        }
      } catch (err) {
        console.error(err)
        return { statusCode: 500, body: JSON.stringify({ error: 'Unable to update job' }) }
      }

    case 'DELETE':
      try {
        const { status } = JSON.parse(event.body);
        if (status === 'all') {
          await Job.deleteMany({ userId });
        } else {
          await Job.deleteMany({ userId, status });
        }
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true })
        };
      } catch (err) {
        console.error(err);
        return { statusCode: 500, body: JSON.stringify({ error: 'Unable to delete jobs' }) };
      }


    default:
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }
}
