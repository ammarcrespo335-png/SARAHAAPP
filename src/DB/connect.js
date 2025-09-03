import mongoose from 'mongoose'
export const connectionDB = async () => {
   
  await mongoose
    .connect(process.env.DB_uri)
    .then(() => {
      console.log('mongo db is connected')
    })
    .catch(err => {
      console.log('mongo db isn`t connected', err)
    })
}
