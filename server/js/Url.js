const authAudienceUrl = process.env.NODE_ENV === 'development'
  ? 'http://local.mapboard/'
  : 'https://mapboard.io/'

module.exports = {
  authAudienceUrl
}
