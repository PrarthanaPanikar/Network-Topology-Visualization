import axios from 'axios'

const API_BASE_URL = 'https://network-topology-visualization.onrender.com/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Device endpoints
export const getDevices = () => apiClient.get('/devices')
export const createDevice = (device: any) => apiClient.post('/devices', device)
export const updateDevice = (id: string, updates: any) => apiClient.put(`/devices/${id}`, updates)
export const deleteDevice = (id: string) => apiClient.delete(`/devices/${id}`)
export const duplicateDevice = (id: string) => apiClient.post(`/devices/${id}/duplicate`)
export const getDeviceNeighbors = (id: string) => apiClient.get(`/devices/${id}/neighbors`)

// Connection endpoints
export const getConnections = () => apiClient.get('/connections')
export const createConnection = (source: string, target: string, speed: string = 'gigabit') =>
  apiClient.post('/connections', { source, target, speed })
export const deleteConnection = (id: string) => apiClient.delete(`/connections/${id}`)

// Topology endpoints
export const getTopology = () => apiClient.get('/topology')
export const loadDemoTopology = () => apiClient.post('/topology/load-demo')
export const resetTopology = () => apiClient.post('/topology/reset')
export const loadTopology = (topology: any) => apiClient.post('/topology/load', topology)
export const saveTopology = (topology: any) => apiClient.post('/topology/save', topology)

// Export endpoints
export const exportJSON = () => 
  apiClient.get('/export/json', { responseType: 'json' }).then(response => {
    // If response is already JSON string, parse it; otherwise return as-is
    if (typeof response.data === 'string') {
      return { ...response, data: JSON.parse(response.data) }
    }
    return response
  })

export const exportDevicesCSV = () => 
  apiClient.get('/export/csv/devices', { responseType: 'blob' })

export const exportConnectionsCSV = () => 
  apiClient.get('/export/csv/connections', { responseType: 'blob' })

// Import endpoints
export const importJSON = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiClient.post('/import/json', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export default apiClient
