export const frontendUrl = process.env.NODE_ENV === 'development'
  ? 'http://local.mapboard/'
  : 'https://mapboard.io/'

export const backendUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8083'
  : ''
