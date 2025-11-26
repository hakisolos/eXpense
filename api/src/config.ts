import mongoose from "mongoose";


const connb = async () => {
    console.log('connecting database')
    try {
        await mongoose.connect(String(process.env.CSTRING))
    } catch (e) {
        console.log(e)
    }
}

export default connb