const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            pass: process.env.DB_PASSWORD,
            user: process.env.DB_USER
        });

        console.log('Connecté à la DB');
    } catch (e) {
        console.log('Erreur connection DB', e);
        process.exit(1);
    }
}

module.exports = connectDB;