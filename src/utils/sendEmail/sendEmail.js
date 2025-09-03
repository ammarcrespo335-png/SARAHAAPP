import nodemailer from 'nodemailer'

export const sendEmail = async({ to, subject, html }) => {
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
  const main = async () => {
    const info = await transporter.sendMail({
      from: `sarhaAAP<${process.env.auth_User}>`,
      to,
      subject,
      html,
    })
  }
  main().catch(err => {
    console.log({ EmailError: err })
  })
}
