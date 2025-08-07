import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Mock active connections
const activeConnections = new Map()

// Available servers
const servers = [
  {
    id: 'singapore-1',
    name: 'Singapore Server',
    location: 'Singapore',
    configFile: 'singapore.ovpn'
  }
]

app.get('/api/servers', (req, res) => {
  res.json(servers)
})

// Mock connect - simulates connection without actual OpenVPN
app.post('/api/connect', (req, res) => {
  const { userId, serverId } = req.body
  
  console.log(`Mock connecting user ${userId} to server ${serverId}`)
  
  // Simulate connection delay
  setTimeout(() => {
    activeConnections.set(userId, { connected: true, serverId })
    res.json({ 
      success: true, 
      message: 'Mock VPN connection successful',
      server: 'Singapore Server'
    })
  }, 2000)
})

// Mock disconnect
app.post('/api/disconnect', (req, res) => {
  const { userId } = req.body
  
  console.log(`Mock disconnecting user ${userId}`)
  
  if (activeConnections.has(userId)) {
    activeConnections.delete(userId)
    res.json({ success: true, message: 'Mock VPN disconnected' })
  } else {
    res.status(400).json({ error: 'No active connection found' })
  }
})

// Get connection status
app.get('/api/status/:userId', (req, res) => {
  const { userId } = req.params
  const isConnected = activeConnections.has(userId)
  
  res.json({ 
    connected: isConnected,
    userId 
  })
})

app.listen(PORT, () => {
  console.log(`Mock VPN Backend running on port ${PORT}`)
  console.log('This is a MOCK server - no actual VPN connections are made')
})