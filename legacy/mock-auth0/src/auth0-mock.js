const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

onExecutePostUserRegistration = async (event, api) => {
  await fetch(event.secrets.MAPBOARD_SERVER_URL + '/registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'MAPBOARD-SERVER-KEY': event.secrets.MAPBOARD_SERVER_KEY,
    },
    body: JSON.stringify({
      user: {
        email: event.user.email,
        name: event.user.name
      }
    }),
  })
}

const event = {
  "request": {
    "ip": "13.33.86.47",
    "language": "en",
    "method": "POST",
    "geoip": {
      "cityName": "Bellevue",
      "continentCode": "NA",
      "countryCode3": "USA",
      "countryCode": "US",
      "countryName": "United States of America",
      "latitude": 47.61793,
      "longitude": -122.19584,
      "subdivisionCode": "WA",
      "subdivisionName": "Washington",
      "timeZone": "America/Los_Angeles"
    },
    "hostname": "mapboard.example.com",
    "user_agent": "curl/7.64.1"
  },
  "connection": {
    "id": "con_fpe5kj482KO1eOzQ",
    "name": "Username-Password-Authentication",
    "metadata": {},
    "strategy": "auth0"
  },
  "tenant": {
    "id": "mapboard"
  },
  "transaction": {
    "acr_values": [],
    "id": "",
    "locale": "",
    "requested_scopes": [],
    "ui_locales": [],
    "protocol": "oauth2-access-token",
    "redirect_uri": "http://someuri.com",
    "prompt": [
      "none"
    ],
    "login_hint": "test@test.com",
    "response_mode": "form_post",
    "response_type": [
      "id_token"
    ],
    "state": "AABBccddEEFFGGTTasrs"
  },
  "user": {
    "tenant": "mapboard",
    "username": "j+smith",
    "email": "j+smith@example.com",
    "phoneNumber": "123-123-1234",
    "user_id": "auth0|5f7c8ec7c33c6c004bbafe82",
    "created_at": "2024-07-21T08:11:41.810Z",
    "email_verified": true,
    "family_name": "Smith",
    "given_name": "John",
    "last_password_reset": "2024-07-21T08:11:41.810Z",
    "name": "John Smith",
    "nickname": "j+smith",
    "phone_number": "123-123-1234",
    "phone_verified": true,
    "picture": "http://www.gravatar.com/avatar/?d=identicon",
    "updated_at": "2024-07-21T08:11:41.810Z",
    "app_metadata": {},
    "user_metadata": {}
  }
}

onExecutePostUserRegistration(Object.assign(event, {secrets: {
  'MAPBOARD_SERVER_URL': process.env.MAPBOARD_SERVER_URL,
  'MAPBOARD_SERVER_KEY': process.env.MAPBOARD_SERVER_KEY
}}), null).then(() => {})
