const mongoose = require('mongoose')

const incidentSchema = new mongoose.Schema({
  title: String,
  component: String,
  severity: { type: String, enum: ['P0', 'P1', 'P2', 'P3'] },
  status: { type: String, default: 'OPEN', enum: ['OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'] },
  rca: {
    rootCause: String,
    fixApplied: String,
    preventionSteps: String,
    startTime: Date,
    endTime: Date
  },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Incident', incidentSchema)
