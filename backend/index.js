const fastify = require('fastify')({ logger: true })
const cors = require('@fastify/cors')
const mongoose = require('mongoose')
const redis = require('redis')
const incidentRoutes = require('./routes/incidents')

fastify.register(cors)
fastify.register(incidentRoutes)

mongoose.connect('mongodb://127.0.0.1:27017/incidents')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err.message))

const redisClient = redis.createClient({ url: 'redis://127.0.0.1:6379' })
redisClient.connect()
  .then(() => console.log('Redis connected'))
  .catch(err => console.log('Redis error:', err.message))

fastify.get('/health', async () => {
  return { status: 'ok', message: 'IMS is running' }
})

let signalCount = 0
setInterval(() => {
  console.log(`Throughput: ${signalCount} signals/sec`)
  signalCount = 0
}, 5000)

fastify.listen({ port: 8000, host: '0.0.0.0' }, (err) => {
  if (err) throw err
  console.log('Server running on port 8000')
})
