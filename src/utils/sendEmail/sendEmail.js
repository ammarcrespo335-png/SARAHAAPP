import { customAlphabet } from 'nanoid'
import nodemailer from 'nodemailer'

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.transporter_host,
    port: process.env.transporter_Port,
    secure: true,
    service: 'gmail',
    auth: {
      user: process.env.auth_User,
      pass: process.env.auth_Pass,
    },
  })

  const info = await transporter.sendMail({
    from: ` Saraha App📩<${process.env.auth_User}>`,
    to,
    subject,
    html,
  })

  console.log('Email sent:', info.messageId)
  return true 
}

export const createOtp = () => {
  const custom = customAlphabet('0123456789')
  const otp = custom(6)
  return otp
}