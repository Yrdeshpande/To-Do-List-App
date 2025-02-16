const mongoose = require("mongoose");

module.exports = async () => {

    try {
        const mongoHost = process.env.MONGO_HOST || 'mongodb-service';
        const mongoPort = process.env.MONGO_PORT || '27017';

        await mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/task`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to database.");
    } catch (error) {
        console.error("Could not connect to database.", error);
    }
};
