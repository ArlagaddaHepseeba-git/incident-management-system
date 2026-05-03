const mongoose = require('mongoose')

const signalSchema = new mongoose.Schema({
  componentId: String,
  errorType: String,
  message: String,
  latency: Number,
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Signal', signalSchema)
