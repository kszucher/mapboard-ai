const authAudienceUrl = process.env.NODE_ENV === undefined
  ? 'http://local.mapboard/'
  : 'https://mapboard.io/'

module.exports = {
  authAudienceUrl
}
