import express from 'express'
import cors from 'cors'
import { spawn } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Store active connections
const activeConnections = new Map()

// Available servers configuration
const servers = [
  {
    id: 'singapore-1',
    name: 'Singapore Server',
    location: 'Singapore',
    configFile: 'singapore.ovpn',
    certCN: 'cn_XjO3qfazXTAssqzCt'
  }
]

// Get available servers
app.get('/api/servers', (req, res) => {
  res.json(servers)
})

// Connect to VPN
app.post('/api/connect', async (req, res) => {
  const { userId, serverId } = req.body

  try {
    const server = servers.find(s => s.id === serverId)
    if (!server) {
      return res.status(400).json({ error: 'Server not found' })
    }

    const configPath = path.join(process.cwd(), 'configs', server.configFile)
    
    if (!existsSync(configPath)) {
      return res.status(400).json({ error: 'Configuration file not found' })
    }

    // Kill existing connection if any
    if (activeConnections.has(userId)) {
      const existingProcess = activeConnections.get(userId)
      existingProcess.kill()
      activeConnections.delete(userId)
    }

    // Start OpenVPN process
    const vpnProcess = spawn('openvpn', [
      '--config', configPath,
      '--log', path.join(process.cwd(), 'logs', `${userId}.log`),
      '--daemon'
    ])

    vpnProcess.on('error', (error) => {
      console.error('OpenVPN process error:', error)
      activeConnections.delete(userId)
    })

    vpnProcess.on('exit', (code) => {
      console.log(`OpenVPN process exited with code ${code}`)
      activeConnections.delete(userId)
    })

    activeConnections.set(userId, vpnProcess)

    res.json({ 
      success: true, 
      message: 'VPN connection initiated',
      server: server.name
    })

  } catch (error) {
    console.error('Connection error:', error)
    res.status(500).json({ error: 'Failed to connect to VPN' })
  }
})

// Disconnect from VPN
app.post('/api/disconnect', (req, res) => {
  const { userId } = req.body

  try {
    if (activeConnections.has(userId)) {
      const vpnProcess = activeConnections.get(userId)
      
      // Force kill the process
      vpnProcess.kill('SIGKILL')
      activeConnections.delete(userId)
      
      // Also kill any remaining OpenVPN processes
      spawn('pkill', ['-f', 'openvpn'])
      
      res.json({ success: true, message: 'VPN disconnected' })
    } else {
      res.status(400).json({ error: 'No active connection found' })
    }
  } catch (error) {
    console.error('Disconnect error:', error)
    res.status(500).json({ error: 'Failed to disconnect VPN' })
  }
})

// Download OpenVPN config file
app.get('/api/download/:serverId', (req, res) => {
  const { serverId } = req.params
  
  try {
    const server = servers.find(s => s.id === serverId)
    if (!server) {
      return res.status(404).json({ error: 'Server not found' })
    }

    const configPath = path.join(process.cwd(), 'configs', server.configFile)
    
    if (!existsSync(configPath)) {
      return res.status(404).json({ error: 'Configuration file not found' })
    }

    // Read and modify config if needed
    let configContent = readFileSync(configPath, 'utf8')
    
    // Replace or add correct CN verification
    if (server.certCN) {
      if (configContent.includes('verify-x509-name')) {
        configContent = configContent.replace(
          /verify-x509-name\s+\S+\s+name/,
          `verify-x509-name ${server.certCN} name`
        )
      } else {
        configContent = configContent.replace(
          'remote-cert-tls server',
          `remote-cert-tls server\nverify-x509-name ${server.certCN} name`
        )
      }
    }
    
    res.setHeader('Content-Type', 'application/x-openvpn-profile')
    res.setHeader('Content-Disposition', `attachment; filename="${server.name.replace(/\s+/g, '-').toLowerCase()}.ovpn"`)
    res.send(configContent)
  } catch (error) {
    console.error('Download error:', error)
    res.status(500).json({ error: 'Failed to download configuration' })
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
  console.log(`VPN Backend running on port ${PORT}`)
  console.log('Make sure OpenVPN is installed and accessible via command line')
})