import CryptoJS from 'crypto-js'

export const encryption = textToEncrypt => {
  return CryptoJS.AES.encrypt(
    textToEncrypt,
    process.env.CRYPTOJS_SECRET
  ).toString()
}
export const decryption = encryptedText => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedText,
    process.env.CRYPTOJS_SECRET
  ).toString(CryptoJS.enc.Utf8)
}
