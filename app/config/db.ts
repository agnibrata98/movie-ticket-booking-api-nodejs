//importing modules
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

  //details from the env
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const dbName = 'movie_booking_application'

//connection string to mongo atlas

const connectionString = process.env.DB_URI

if (!connectionString) {
    throw new Error('DB_URI environment variable is not defined')
}


//db connection
export const db = mongoose.connect(connectionString)
.then(res => {
    if(res){
        console.log(`Database connection succeffully to ${dbName}`)
    }
    
}).catch(err => {
    console.log(err)
})
