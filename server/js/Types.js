const ACTIVATION_STATUS = {
  COMPLETED: 'completed',
  AWAITING_CONFIRMATION: 'awaitingConfirmation'
}

const ACCESS_TYPES = {
  UNAUTHORIZED: 'unauthorized',
  VIEW: 'view',
  EDIT: 'edit',
}

const SHARE_STATUS = {
  WAITING: 'waiting',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
}

module.exports= {
  ACTIVATION_STATUS,
  ACCESS_TYPES,
  SHARE_STATUS
}
