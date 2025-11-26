import mongoose from "mongoose";

mongoose.connect("mongodb://user_fad6c8c0:qTDyLO2uWoQH4V0JeBNu0VpTISjxfMdrd00TmVgQ3sNTOPYuTuIL0pGPW3dTGSQq@db.pxxl.pro:7434/?directConnection=true")
    .then(() => {
        console.log("connected!");
        process.exit(0);
    })
    .catch(e => {
        console.error("error:", e);
        process.exit(1);
    });
