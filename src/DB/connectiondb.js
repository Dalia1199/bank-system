import mongoose from "mongoose"
import { db_uri } from "../../conflig/confligservice.js"


const checkconnectiondb = async () => {
    await mongoose.connect(db_uri, { serverSelectionTimeoutMS: 5000 })
        .then(() => {
            console.log(`DB is connected successfuly ${db_uri}😊😊`)
        })
        .catch((error) => {
            console.log(error, "fail to connect to DB😒😒")
        })
}
export default checkconnectiondb
// mongodb://localhost:27017