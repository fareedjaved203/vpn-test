import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [servers, setServers] = useState([])

  useEffect(() => {
    fetchServers()
  }, [])

  const fetchServers = async () => {
    try {
      const response = await axios.get('/api/servers')
      setServers(response.data)
    } catch (error) {
      console.error('Failed to fetch servers:', error)
    }
  }

  const downloadConfig = (serverId) => {
    window.open(`/api/download/${serverId}`, '_blank')
  }

  return (
    <div className="app">
      <h1>VPN Configuration Download</h1>
      
      <div className="servers">
        <h3>Available Servers</h3>
        {servers.map(server => (
          <div key={server.id} className="server-item">
            <div className="server-info">
              <strong>{server.name}</strong> - {server.location}
            </div>
            <button 
              className="download-btn"
              onClick={() => downloadConfig(server.id)}
            >
              Download .ovpn
            </button>
          </div>
        ))}
      </div>

      <div className="manual-setup">
        <h3>Setup Instructions</h3>
        <p>1. Download the .ovpn file above</p>
        <p>2. Install OpenVPN client on your device</p>
        <p>3. Import the .ovpn file into your OpenVPN client</p>
        <p>4. Connect using your OpenVPN client</p>
      </div>
    </div>
  )
}

export default App