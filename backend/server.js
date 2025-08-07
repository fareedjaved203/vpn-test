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

    const configContent = `client
dev tun
proto udp
remote 139.99.61.185 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
auth SHA512
ignore-unknown-option block-outside-dns
verb 3

<cert>
-----BEGIN CERTIFICATE-----
MIIDUzCCAjugAwIBAgIRAIIYRugoIFSuJ2htR2yFrAUwDQYJKoZIhvcNAQELBQAw
FjEUMBIGA1UEAwwLRWFzeS1SU0EgQ0EwHhcNMjUwODA3MjIzNjE1WhcNMzUwODA1
MjIzNjE1WjAPMQ0wCwYDVQQDDAR0ZXN0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEA1OBOSHMIHw72y4m4NvVsYmU8JmErshRS5jPcE4Yjn0D4E6eHHfPc
h7n3X2I5Fnqj4bCX+A9t/MbJ9sv0It3k9KXO9tsicURdgq1mK5EfVl+Kb79O4drC
NctmOtG9qAJxU8VbtDH63+vXtmArOW/3G+jHkf3YSfV059Q7DEj7Gvd1AJcsSfwq
AKOtVKWYcUHLfCpxonzMtHw7I0xWMohXXk+7pp5zEsiLaIZclGN6xjuyJNNQmIKv
oP0obOS3Dn3Iy93BsCe5fwcJPXHSINzlcDBVq74vi6LLduZw1dd8cKulQzREgAbL
C1560OsH6aVXOs/4YEJaHLxKFnyMGFadbwIDAQABo4GiMIGfMAkGA1UdEwQCMAAw
HQYDVR0OBBYEFHrQoTJ58PAQuAQHUEDt6d7BLtpqMFEGA1UdIwRKMEiAFH3veZ5H
xWUdKsrbj/AUW+QMaFsOoRqkGDAWMRQwEgYDVQQDDAtFYXN5LVJTQSBDQYIUG+8n
RPRhnxW4LzpASDD/AHWYKWMwEwYDVR0lBAwwCgYIKwYBBQUHAwIwCwYDVR0PBAQD
AgeAMA0GCSqGSIb3DQEBCwUAA4IBAQCmKeCQsJlTQiYqIwBta/pUDuF8br7GMve8
tVTVtWe5FsOidJxB1qCFZQWk3GomKz76ZrZcZ4521byZuc2NrLqJ/pQ9HTTlV6wB
nbWcZvhYMftMMJOcVmpNHffOBdvlMcmO5dxljqMx7AYGvAg7i/dYadbsKxpTToy5
qluGwBQC4fWRXLt8m9afWXzrqQwWSAClppjlwwW5P8kpkUMyyVebP8qcjE9B2ys/
BQAXnO9kTN+jDP2k+anvRr0LseEyDI4qH1feWgfbHgvYFfJnBhIVfQsqtdJzEF9M
uYEfPJKAbHX1NOoYfFIFI2g4kUJmg8H9E+bpRfRKGc0AiN1ufQME
-----END CERTIFICATE-----
</cert>

<key>
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDU4E5IcwgfDvbL
ibg29WxiZTwmYSuyFFLmM9wThiOfQPgTp4cd89yHufdfYjkWeqPhsJf4D238xsn2
y/Qi3eT0pc722yJxRF2CrWYrkR9WX4pvv07h2sI1y2Y60b2oAnFTxVu0Mfrf69e2
YCs5b/cb6MeR/dhJ9XTn1DsMSPsa93UAlyxJ/CoAo61UpZhxQct8KnGifMy0fDsj
TFYyiFdeT7umnnMSyItohlyUY3rGO7Ik01CYgq+g/Shs5LcOfcjL3cGwJ7l/Bwk9
cdIg3OVwMFWrvi+Lost25nDV13xwq6VDNESABssLXnrQ6wfppVc6z/hgQlocvEoW
fIwYVp1vAgMBAAECggEAXLbq8XwEU/6g94oebPVcRMiht3eH3/IhHvkER46bMi/K
PEkxPJbq/EQ/HNB7W7KDcPcIYTZbKYZtDSvMQ2lQYEtdBj/v0tQ7RACAqMX2l5ha
A4yXbx/niSVy+3hBOY0CzcD9zVAdW2xtEZX2DXiZ8BJk5U1hZ+jbh2L0asfYcef8
cN3x+WJQSL+skEjP9Ya2DzMAG/9Ov7vVn8kNrlC4/TaJqMczcfdcVDmmokOpCXAS
ouPjH1nuvXTakmcR+YzCjifbZvcXG561MGQEEZO+6D6Jeql+mguoYeE0nqbtga2I
Kb1D8FJVSVbezdm6+O4S8D5f/I9rjaMvfkOWZmOZwQKBgQDdfKlxPVIev9JjOOP+
nMtFOaxGb3TdYMhjWxLBso2g3+LQ4Vjx39WqxourKfQEgZLtPcXWPRXgJDDNeo78
JMDY7ADpjpoo/x09JB6ybFy/3/za3p/cgD2j6wsLR1+a5WapAGcfOnICQJsQmGOz
pWAR2hRCg2EVc4QDK/gIqjcTwQKBgQD2DCbaqni6SX7FANnfaBZdc+D6t/wYCSva
8UqTgWyXT124e/94VhzO7FJRs6v1RibNVWG4smdVkSuDfNVzccBzqrEvDIoLJnAi
FzA0TjV+zp2AgOuIKolvDKpoyDVyrPgiKj2zt6uhnWua3Gaxg3WpxXoB9FRiw6BQ
RDfQxcU9LwKBgQClicTCpAg6fzfpfN26sMmkJaTCyA7aXrmmuKzeJGuCL5NAdwyZ
SqhRiS9ecG6253k+44p3wxQUgDgRe2ZewcF433sXFMPXnEToK5Td2evAZNKBax6k
GRz45HVOqruj84y1B14Lkw0e7dZ3os3xuMqCzTGTPMpU1A94p2YsY7vigQKBgFk/
dyiCBWCtIAqdkGn0+4fSbJ0E97BQQ1Qbig2POLB53Wj5sWUY90InfoScQ5eoZpK8
kcHJFKp5Ceub8GD7te8+zx5d0gTRYIM9HgMbC1R/5amjGcw+gbOCSJ3RYXHDRA5A
fDkgOmVZEJsPr0BciuWV9/eVhLZ+dzwmQoi79BuJAoGBANIEYgDMDTl6hIGHTMPe
aYp8UoPjIg9gizcr5tVzU/mAwU3xcAgd/yyLEAuicymoaJZ5NlRoQWvHChin8hLD
BKKckNJSN9Tb+GIKPrKhgqKWpMZ2z4ekkd2sdWmERRQYOkhiZNsj6fMQzXofpETr
GywG40muNoIpg6ejjigeOkNU
-----END PRIVATE KEY-----
</key>

<ca>
-----BEGIN CERTIFICATE-----
MIIDSzCCAjOgAwIBAgIUG+8nRPRhnxW4LzpASDD/AHWYKWMwDQYJKoZIhvcNAQEL
BQAwFjEUMBIGA1UEAwwLRWFzeS1SU0EgQ0EwHhcNMjUwODA3MjIzNjEzWhcNMzUw
ODA1MjIzNjEzWjAWMRQwEgYDVQQDDAtFYXN5LVJTQSBDQTCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBAKrFJaf7hxckSl+IZF9PK2wcKr+FlDXd/2DdSPw1
4Au/MvQl4IsaA5/Iz0Aub24KFneAOJBawTbgQiGN1lzdG/l/16fC88NcnFrr2jPx
0VTi2N0gB1VjYHTmF63zUDWgZerLcbAuEdCq9+3/MwjDbSzsgtv9LN69C6Sgnh/7
QgDNc+caTwN0wufOU9dGVx1UkGNze24UQ48om0pKMy5x3n7XqBiPfWibnd+nn8Le
EtPMMbmhnBlvPgE7yEnP/O39otGQxepJUY1kYQoPjVJZVe3EMuu8gw0OxVd1W/Gr
3itB9J0PBc8sWNUMozwDnUV8RkD3o5tPTQtKktsNOtsnXfECAwEAAaOBkDCBjTAM
BgNVHRMEBTADAQH/MB0GA1UdDgQWBBR973meR8VlHSrK24/wFFvkDGhbDjBRBgNV
HSMESjBIgBR973meR8VlHSrK24/wFFvkDGhbDqEapBgwFjEUMBIGA1UEAwwLRWFz
eS1SU0EgQ0GCFBvvJ0T0YZ8VuC86QEgw/wB1mCljMAsGA1UdDwQEAwIBBjANBgkq
hkiG9w0BAQsFAAOCAQEAfCOd/vmP7NUu/wkSuXTvGQAtlb+x0MhMYbL8X3JKR5b4
pm0Pm3xNZLGHImBi9lcxiIVkPQpzxFM3BoKa+mstJDC35xO180vyw6kUNsWLnIas
ZErE5C11gcWZlbhyDQEExfqU/yHPorsL8cEW8M7EGLHJzHM07b5wV6w2nPA42K4o
WF9e1KKd8SKo9qBUNDZRaPyAeHsK3Tn4DqLE2khN/xIbv6tcLHMTn+dmRM6wsXbZ
kZTb3QW4vbdwhGW7CmPg6qm9uVheudAdNkyz7C+bhYLAKAYyr9QkaDtN7+ieMvMl
z9pnnA8ZCV6b7OSBL4DeyT5Nn4oAmwUj+WsroZ52AA==
-----END CERTIFICATE-----
</ca>

<tls-crypt>
-----BEGIN OpenVPN Static key V1-----
09df5a14b156837adc488da004fb4c06
a4c2891cbf5a2e5fe6efe8eb22d2af25
7e621d6b8def2bb28d95679f020ae6b2
1e08fd82bcbd2c6ee5d42860f128e65d
23ddf1aabc7abe969fea98d57660eefe
7e3f5776e9709ef327e67aaec252ab46
4900f1fda097a3ea9f8c622b8cff26b5
7d02baca06831ac2310719f913e51cd1
563bc00f3a096d1a5fa693d15e3be612
433b53e9568944fa806287b80b109b9f
dd75340e63b46d17367e9834f739a0df
95eb9ee41ab52b47de81ca6c54a4a662
c6f4765affded7f1952cefea5a2d391f
3f8bab6445626474e6bfa7b6e376c597
a2e65963fd73627844ab9bf4476f3133
64a35a8d2795bd720758a9dd1e7b25ba
-----END OpenVPN Static key V1-----
</tls-crypt>`
    
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