import { compareSync, hashSync } from 'bcryptjs'


export const hash = text => {
  return hashSync(text, Number(process.env.BCRYPT_SALT_HASH))
}

export const compare_hash = (text,hashedText) => {
    return compareSync(text,hashedText)
}