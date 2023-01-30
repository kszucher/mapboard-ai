export const backendUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8082'
  : 'https://mapboard-server.herokuapp.com/'
