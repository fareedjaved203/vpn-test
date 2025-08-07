import express from 'express'
import cors from 'cors'
import { readFileSync, existsSync } from 'fs'
import path from 'path'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Available servers configuration
const servers = [
  {
    id: 'singapore-1',
    name: 'Singapore Server',
    location: 'Singapore',
    configFile: 'singapore.ovpn'
  }
]

// Get available servers
app.get('/api/servers', (req, res) => {
  res.json(servers)
})

// Download OpenVPN config file
app.get('/api/download/:serverId', (req, res) => {
  const { serverId } = req.params
  
  try {
    const server = servers.find(s => s.id === serverId)
    if (!server) {
      return res.status(404).json({ error: 'Server not found' })
    }

    // Read the working .ovpn file from /root/client1.ovpn
    const configContent = readFileSync('/root/client1.ovpn', 'utf8')
    
    res.setHeader('Content-Type', 'application/x-openvpn-profile')
    res.setHeader('Content-Disposition', `attachment; filename="${server.name.replace(/\s+/g, '-').toLowerCase()}.ovpn"`)
    res.send(configContent)
  } catch (error) {
    console.error('Download error:', error)
    res.status(500).json({ error: 'Failed to download configuration' })
  }
})

app.listen(PORT, () => {
  console.log(`VPN Configuration Server running on port ${PORT}`)
})