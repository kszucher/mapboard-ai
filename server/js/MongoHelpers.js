const getLastElemField = ( field, array ) => ({
  $getField: { field, input: { $last: array } }
})

const getIndexOfFrameId = (frameId) => ({
  $indexOfArray: [ { $map: { input: '$framesInfo', as: 'elem', in: { $getField: { field: 'frameId', input: '$$elem' } } } }, frameId ]
})

const getFrameIdOfIndex = (index) => ({
  $getField: { field: 'frameId', input: { $arrayElemAt: ['$framesInfo', index] } }
})

const getSessionField = (sessionId, field) => ({
  $getField: {
    field,
    input: {
      $first: {
        $filter: {
          input: '$sessions',
          as: 'session',
          cond: { $eq: ["$$session.sessionId", sessionId] }
        }
      }
    }
  }
})

const setSession = (sessionId, mapId, frameId) => ({
  $set: {
    sessions: {
      $map: {
        input: "$sessions",
        as: "session",
        in: {
          $cond: {
            if: { $eq: [ '$$session.sessionId', sessionId ] },
            then: { sessionId, mapId, frameId },
            else: "$$session"
          }
        }
      }
    }
  }
})

module.exports = {
  getLastElemField,
  getIndexOfFrameId,
  getFrameIdOfIndex,
  getSessionField,
  setSession
}
