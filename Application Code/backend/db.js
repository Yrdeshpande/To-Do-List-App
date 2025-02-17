const mongoose = require("mongoose");

module.exports = async () => {

    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://mongodb-service:27017/task";

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to database.");
    } catch (error) {
        console.error("Could not connect to database.", error);
    }
};
