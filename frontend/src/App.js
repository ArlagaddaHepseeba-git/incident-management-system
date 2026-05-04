import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://3.81.87.159:8000'

function App() {
  const [incidents, setIncidents] = useState([])
  const [selected, setSelected] = useState(null)
  const [rca, setRca] = useState({ rootCause: '', fixApplied: '', preventionSteps: '' })

  useEffect(() => {
    fetchIncidents()
    const interval = setInterval(fetchIncidents, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchIncidents = async () => {
    try {
      const res = await axios.get(API + '/incidents')
      setIncidents(res.data)
    } catch(err) {
      console.log(err)
    }
  }

  const closeIncident = async () => {
    try {
      await axios.put(API + '/incidents/' + selected._id + '/status', { status: 'CLOSED', rca })
      alert('Incident Closed!')
      fetchIncidents()
      setSelected(null)
    } catch(err) {
      alert('RCA is required!')
    }
  }

  return (
    <div style={{padding:'20px'}}>
      <h1>Incident Management System</h1>
      <h2>Active Incidents</h2>
      {incidents.length === 0 && <p>No incidents yet</p>}
      {incidents.map(inc => (
        <div key={inc._id} onClick={() => setSelected(inc)}
          style={{border:'1px solid red',padding:'10px',marginBottom:'10px',cursor:'pointer'}}>
          {inc.title} | {inc.severity} | {inc.status}
        </div>
      ))}
      {selected && (
        <div style={{border:'2px solid blue',padding:'20px',marginTop:'20px'}}>
          <h2>Incident Detail</h2>
          <p><b>Title:</b> {selected.title}</p>
          <p><b>Component:</b> {selected.component}</p>
          <p><b>Severity:</b> {selected.severity}</p>
          <p><b>Status:</b> {selected.status}</p>
          <h2>RCA Form</h2>
          <p>Root Cause: <select onChange={e => setRca({...rca, rootCause: e.target.value})}>
            <option value="">Select</option>
            <option value="Hardware Failure">Hardware Failure</option>
            <option value="Network Issue">Network Issue</option>
            <option value="Software Bug">Software Bug</option>
            <option value="Human Error">Human Error</option>
          </select></p>
          <p>Fix Applied: <textarea onChange={e => setRca({...rca, fixApplied: e.target.value})} /></p>
          <p>Prevention Steps: <textarea onChange={e => setRca({...rca, preventionSteps: e.target.value})} /></p>
          <button onClick={closeIncident} style={{background:'red',color:'white',padding:'10px',border:'none',cursor:'pointer'}}>
            Close Incident
          </button>
        </div>
      )}
    </div>
  )
}

export default App
