export const pythonBackendUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8083'
  : ''

export const authAudienceUrl = process.env.NODE_ENV === 'development'
  ? 'http://local.mapboard/'
  : 'https://mapboard.io/'
