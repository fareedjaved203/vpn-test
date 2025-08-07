import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [status, setStatus] = useState('disconnected')
  const [servers, setServers] = useState([])
  const [selectedServer, setSelectedServer] = useState(null)
  const [connectionTime, setConnectionTime] = useState(0)
  const [userId] = useState(() => {
    // Fallback UUID generator for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  })

  useEffect(() => {
    fetchServers()
  }, [])

  useEffect(() => {
    let interval
    if (status === 'connected') {
      interval = setInterval(() => {
        setConnectionTime(prev => prev + 1)
      }, 1000)
    } else {
      setConnectionTime(0)
    }
    return () => clearInterval(interval)
  }, [status])

  const fetchServers = async () => {
    try {
      const response = await axios.get('/api/servers')
      setServers(response.data)
      if (response.data.length > 0) {
        setSelectedServer(response.data[0])
      }
    } catch (error) {
      console.error('Failed to fetch servers:', error)
    }
  }

  const toggleConnection = async () => {
    if (status === 'connecting') return

    try {
      if (status === 'disconnected') {
        setStatus('connecting')
        await axios.post('/api/connect', {
          userId,
          serverId: selectedServer.id
        })
        setStatus('connected')
      } else {
        setStatus('connecting')
        await axios.post('/api/disconnect', { userId })
        setStatus('disconnected')
      }
    } catch (error) {
      console.error('Connection failed:', error)
      setStatus('disconnected')
    }
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="app">
      <h1>VPN Client</h1>
      
      <div className="status">
        <div className={`status-indicator ${status}`}></div>
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>

      {status === 'connected' && (
        <div className="timer">
          Connected: {formatTime(connectionTime)}
        </div>
      )}

      <div className="servers">
        <h3>Available Servers</h3>
        {servers.map(server => (
          <div
            key={server.id}
            className={`server-item ${selectedServer?.id === server.id ? 'selected' : ''}`}
            onClick={() => setSelectedServer(server)}
          >
            <strong>{server.name}</strong> - {server.location}
          </div>
        ))}
      </div>

      <button
        className="connect-btn"
        onClick={toggleConnection}
        disabled={status === 'connecting' || !selectedServer}
      >
        {status === 'connecting' ? 'Connecting...' : 
         status === 'connected' ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  )
}

export default App