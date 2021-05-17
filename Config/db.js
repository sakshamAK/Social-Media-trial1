const mongoose = require('mongoose');
const config = require('config');
const db = config.get('MongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Database Connected");
    }
    catch(err) {
        console.error(err.message);
        //to exit all process with failure
        process.exit(1);
    }
}

module.exports = connectDB;