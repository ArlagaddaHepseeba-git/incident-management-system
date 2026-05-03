const Incident = require('../models/incident')
const Signal = require('../models/signal')

async function incidentRoutes(fastify) {

  fastify.get('/incidents', async () => {
    return await Incident.find().sort({ createdAt: -1 })
  })

  fastify.get('/incidents/:id', async (req) => {
    return await Incident.findById(req.params.id)
  })

  fastify.post('/incidents', async (req) => {
    const incident = new Incident(req.body)
    return await incident.save()
  })

  fastify.put('/incidents/:id/status', async (req) => {
    const { status, rca } = req.body
    if (status === 'CLOSED' && !rca) {
      throw new Error('RCA is required to close incident')
    }
    return await Incident.findByIdAndUpdate(req.params.id, { status, rca }, { new: true })
  })

  fastify.post('/signals', async (req) => {
    const signal = new Signal(req.body)
    return await signal.save()
  })

}

module.exports = incidentRoutes
