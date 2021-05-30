const admin = require('firebase-admin');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };