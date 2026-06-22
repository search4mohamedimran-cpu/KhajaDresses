const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Contact = require('../models/Contact');

const DB_FILE = path.join(__dirname, '../db.json');
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://IMRAN:IMRAN%402317@cluster0.jdoux74.mongodb.net/?appName=Cluster0';

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URL);
        console.log('Connected successfully to MongoDB.');

        if (!(await fs.pathExists(DB_FILE))) {
            console.log('No db.json file found. Nothing to migrate.');
            await mongoose.disconnect();
            return;
        }

        const data = await fs.readJson(DB_FILE);
        console.log('Read local db.json successfully.');

        // 1. Migrate Users
        if (data.users && data.users.length > 0) {
            console.log(`Migrating ${data.users.length} users...`);
            let userSuccess = 0;
            for (const user of data.users) {
                const exists = await User.findOne({ email: user.email });
                if (!exists) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        password: user.password
                    });
                    userSuccess++;
                }
            }
            console.log(`Successfully migrated ${userSuccess} users.`);
        }

        // 2. Migrate Feedbacks
        if (data.feedbacks && data.feedbacks.length > 0) {
            console.log(`Migrating ${data.feedbacks.length} feedbacks...`);
            let feedbackSuccess = 0;
            for (const fb of data.feedbacks) {
                const exists = await Feedback.findOne({
                    name: fb.name,
                    comment: fb.comment
                });
                if (!exists) {
                    await Feedback.create({
                        name: fb.name,
                        email: fb.email || '',
                        rating: fb.rating,
                        comment: fb.comment,
                        date: fb.date
                    });
                    feedbackSuccess++;
                }
            }
            console.log(`Successfully migrated ${feedbackSuccess} feedbacks.`);
        }

        // 3. Migrate Contacts
        if (data.contacts && data.contacts.length > 0) {
            console.log(`Migrating ${data.contacts.length} contacts...`);
            let contactSuccess = 0;
            for (const contact of data.contacts) {
                const exists = await Contact.findOne({
                    email: contact.email,
                    message: contact.message
                });
                if (!exists) {
                    await Contact.create({
                        name: contact.name,
                        email: contact.email,
                        phone: contact.phone || '',
                        subject: contact.subject,
                        message: contact.message,
                        date: contact.date
                    });
                    contactSuccess++;
                }
            }
            console.log(`Successfully migrated ${contactSuccess} contacts.`);
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

migrate();
