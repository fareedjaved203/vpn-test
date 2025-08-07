import express from "express";
import cors from "cors";
import { readFileSync, existsSync } from "fs";
import path from "path";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Available servers configuration
const servers = [
  {
    id: "singapore-1",
    name: "Singapore Server",
    location: "Singapore",
    configFile: "singapore.ovpn",
  },
];

// Get available servers
app.get("/api/servers", (req, res) => {
  res.json(servers);
});

// Download OpenVPN config file
app.get("/api/download/:serverId", (req, res) => {
  const { serverId } = req.params;

  try {
    const server = servers.find((s) => s.id === serverId);
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    const configContent = `
client
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
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            82:18:46:e8:28:20:54:ae:27:68:6d:47:6c:85:ac:05
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN=Easy-RSA CA
        Validity
            Not Before: Aug  7 22:36:15 2025 GMT
            Not After : Aug  5 22:36:15 2035 GMT
        Subject: CN=test
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:d4:e0:4e:48:73:08:1f:0e:f6:cb:89:b8:36:f5:
                    6c:62:65:3c:26:61:2b:b2:14:52:e6:33:dc:13:86:
                    23:9f:40:f8:13:a7:87:1d:f3:dc:87:b9:f7:5f:62:
                    39:16:7a:a3:e1:b0:97:f8:0f:6d:fc:c6:c9:f6:cb:
                    f4:22:dd:e4:f4:a5:ce:f6:db:22:71:44:5d:82:ad:
                    66:2b:91:1f:56:5f:8a:6f:bf:4e:e1:da:c2:35:cb:
                    66:3a:d1:bd:a8:02:71:53:c5:5b:b4:31:fa:df:eb:
                    d7:b6:60:2b:39:6f:f7:1b:e8:c7:91:fd:d8:49:f5:
                    74:e7:d4:3b:0c:48:fb:1a:f7:75:00:97:2c:49:fc:
                    2a:00:a3:ad:54:a5:98:71:41:cb:7c:2a:71:a2:7c:
                    cc:b4:7c:3b:23:4c:56:32:88:57:5e:4f:bb:a6:9e:
                    73:12:c8:8b:68:86:5c:94:63:7a:c6:3b:b2:24:d3:
                    50:98:82:af:a0:fd:28:6c:e4:b7:0e:7d:c8:cb:dd:
                    c1:b0:27:b9:7f:07:09:3d:71:d2:20:dc:e5:70:30:
                    55:ab:be:2f:8b:a2:cb:76:e6:70:d5:d7:7c:70:ab:
                    a5:43:34:44:80:06:cb:0b:5e:7a:d0:eb:07:e9:a5:
                    57:3a:cf:f8:60:42:5a:1c:bc:4a:16:7c:8c:18:56:
                    9d:6f
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints:
                CA:FALSE
            X509v3 Subject Key Identifier:
                7A:D0:A1:32:79:F0:F0:10:B8:04:07:50:40:ED:E9:DE:C1:2E:DA:6A
            X509v3 Authority Key Identifier:
                keyid:7D:EF:79:9E:47:C5:65:1D:2A:CA:DB:8F:F0:14:5B:E4:0C:68:5B:0E
                DirName:/CN=Easy-RSA CA
                serial:1B:EF:27:44:F4:61:9F:15:B8:2F:3A:40:48:30:FF:00:75:98:29:63
            X509v3 Extended Key Usage:
                TLS Web Client Authentication
            X509v3 Key Usage:
                Digital Signature
    Signature Algorithm: sha256WithRSAEncryption
    Signature Value:
        a6:29:e0:90:b0:99:53:42:26:2a:23:00:6d:6b:fa:54:0e:e1:
        7c:6e:be:c6:32:f7:bc:b5:54:d5:b5:67:b9:16:c3:a2:74:9c:
        41:d6:a0:85:65:05:a4:dc:6a:26:2b:3e:fa:66:b6:5c:67:8e:
        76:d5:bc:99:b9:cd:8d:ac:ba:89:fe:94:3d:1d:34:e5:57:ac:
        01:9d:b5:9c:66:f8:58:31:fb:4c:30:93:9c:56:6a:4d:1d:f7:
        ce:05:db:e5:31:c9:8e:e5:dc:65:8e:a3:31:ec:06:06:bc:08:
        3b:8b:f7:58:69:d6:ec:2b:1a:53:4e:8c:b9:aa:5b:86:c0:14:
        02:e1:f5:91:5c:bb:7c:9b:d6:9f:59:7c:eb:a9:0c:16:48:00:
        a5:a6:98:e5:c3:05:b9:3f:c9:29:91:43:32:c9:57:9b:3f:ca:
        9c:8c:4f:41:db:2b:3f:05:00:17:9c:ef:64:4c:df:a3:0c:fd:
        a4:f9:a9:ef:46:bd:0b:b1:e1:32:0c:8e:2a:1f:57:de:5a:07:
        db:1e:0b:d8:15:f2:67:06:12:15:7d:0b:2a:b5:d2:73:10:5f:
        4c:b9:81:1f:3c:92:80:6c:75:f5:34:ea:18:7c:52:05:23:68:
        38:91:42:66:83:c1:fd:13:e6:e9:45:f4:4a:19:cd:00:88:dd:
        6e:7d:03:04
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
</tls-crypt>
    `;

    res.setHeader("Content-Type", "application/x-openvpn-profile");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${server.name
        .replace(/\s+/g, "-")
        .toLowerCase()}.ovpn"`
    );
    res.send(configContent);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download configuration" });
  }
});

app.listen(PORT, () => {
  console.log(`VPN Configuration Server running on port ${PORT}`);
});
