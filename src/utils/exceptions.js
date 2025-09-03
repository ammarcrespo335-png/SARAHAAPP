export class notFound extends Error {
  constructor(name = 'url ') {
    super('not found ' + name, { cause: 404 })
  }
}

export class notValidEmail extends Error {
  constructor() {
    super('email already exists', { cause: 404 })
  }
}

export class invalidCredentials extends Error {
  constructor() {
    super('invalid Credentials', { cause: 404 })
  }
}

export class invalidToken extends Error {
  constructor() {
    super(' invalidToken', { cause: 404 })
  }
}


export class notFoundUser extends Error {
  constructor() {
    super(' notFoundUser', { cause: 404 })
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