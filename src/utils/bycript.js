import { compareSync, hashSync } from 'bcryptjs'

export const hash = text => {
  const saltRounds = Number(process.env.BCRYPT_SALT_HASH) || 10 
  return hashSync(text, saltRounds)
}


export const compare_hash = async(text, hashedText) => {
  return   compareSync(text, hashedText)
}
