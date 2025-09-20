import { StatusCodes } from "http-status-codes"

export class notFound extends Error {
  constructor(name = 'url ') {
    super('not found ' + name, { cause: 404 })
  }
}

export class notValidEmail extends Error {
  constructor() {
    super('in-valid email', { cause: 404 })
  }
}

export class invalidCredentials extends Error {
  constructor() {
    super('in-valid Credentials', { cause: 404 })
  }
}

export class invalidToken extends Error {
  constructor() {
    super(' invalidToken', { cause: 404 })
  }
}


export class notFoundUser extends Error {
  constructor() {
    super(' not Found User', { cause: 404 })
  }
}

export class invalidOtp extends Error {
  constructor() {
    super(' otp is in-valid', { cause: 404 })
  }
}
export class otpExpired extends Error {
  constructor() {
    super(' otp expired', { cause: 404 })
  }
}
export class notConfirmed extends Error {
  constructor() {
    super(' please confirm your email', { cause: 404 })
  }
}
export class loginAgain extends Error {
  constructor() {
    super(' please login again', { cause: 404 })
  }
}
export class invalidLoginMethod extends Error {
  constructor() {
    super('invalid Login Method ', { cause: 404 })
  }
}
export class alreadyHasAPasswordLogin extends Error {
  constructor() {
    super('already has a password login', { cause: 404 })
  }
}
export class unAuthorized extends Error {
  constructor() {
    super('unAuthorized', { cause: StatusCodes.UNAUTHORIZED })
  }
}