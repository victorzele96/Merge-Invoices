const express = require("express");
const fileupload = require("express-fileupload");
const schedule = require('node-schedule');
const PDFMerger = require('pdf-merger-js');
const nodemailer = require('nodemailer');   // npm config set strict-ssl=false
const cors = require("cors");
const { admin, db } = require("./admin");
const config = require("./config");
const firebase = require("firebase");
firebase.initializeApp(config);
const path = require('path');
const fs = require('fs');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const PORT = process.env.PORT || 9000;
const app = express();


app.use(cors());
app.use(fileupload());
app.use(express.static("files"));


// upload documents to our server from dashboard page
app.post("/upload", (req, res) => {
  console.log(req.body);
  const userEmail = req.body.email;
  const newpath = __dirname + "/files/";
  const file = req.files.file;
  const filename = userEmail + "#$#" + file.name; // "#$#" + uploadDate +


  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    res.status(200).send({ message: "File Uploaded", code: 200 });
  });
});

const job = schedule.scheduleJob('*/30 * * * *', function(){ //if we want to send merged files on first for each month change it '*/30 * * * *' to '0 8 1 * *'
  console.log('The answer to life, the universe, and everything!');
  
  db.collection("users").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots

        // merge and sent documents to cpa 
        var merger = new PDFMerger();

        //joining path of directory 
        const directoryPath = path.join(__dirname, 'files');
        const directoryMergePath = path.join(__dirname, 'merge-files');

        //passsing directoryPath and callback function
        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) { return console.log('Unable to scan directory: ' + err); } 
              //merge and send file
              (async () => {
                //listing all files using forEach
                files.forEach(function (file) { 
                  if(doc.data().email === file.split("#$#")[0]){
                    merger.add(directoryPath + "/" + file);  //merge all pages. parameter is the path to file and filename.
                    fs.unlink(directoryPath + "/" + file, (err) => { //provides a synchronous method called fs.unlinkSync() inside try catch
                      //handling error
                      if (err) {
                        return console.log('Unable to scan directory: ' + err);
                      } 
                    });
                  };
                });  
                await merger.save(directoryMergePath + '/' + doc.data().email.toString() + '.pdf'); //save under given name and reset the internal document
                
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'merge.invoices.react@gmail.com', //process.env.REACT_APP_USER_EMAIL
                    pass: 'Vvkodcaso0'                      //process.env.REACT_APP_USER_PASSWORD
                    // naturally, replace both with your real credentials or an application-specific password
                  }
                });
                
                const mailOptions = {
                  from: 'merge.invoices.react@gmail.com',
                  to: doc.data().cpa_email.toString(),   //'`${doc.data().cpa_email}`'
                  subject: `Merged invoices from ${doc.data().business_name}`, //${doc.data().cpa_first name}${doc.data().cpa_lastname}
                  text: 'Dudes, we really need your money.',
                  attachments: [{
                    filename: `${doc.data().cpa_email}.pdf`,
                    path: `./merge-files/${doc.data().email}.pdf`,
                    contentType: 'application/pdf'
                  }]
                };
              
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                  console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
              })();
        });
    });
  });
});


var currentUserLoggedIn;
app.post("/currentUser", (req, res) => {
  currentUserLoggedIn = req.body.email;
  console.log(currentUserLoggedIn);
});

app.post("/deleteFile", (req, res) => {

  console.log(req.body.fileName);

      //joining path of directory 
      const directoryPath = path.join(__dirname, 'files');
      const dir = directoryPath + "/" + currentUserLoggedIn + "#$#" + req.body.fileName;
      fs.unlink(dir, (err) => { //provides a synchronous method called fs.unlinkSync() inside try catch
        //handling error
        if (err) {
          return console.log('Unable to scan directory: ' + err);
        } 
      });
});


// documents per user that refer to him
app.post("/view", (req, res) => {
  const perUserFiles = [];

  //joining path of directory 
  const directoryPath = path.join(__dirname, 'files');
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) { return console.log('Unable to scan directory: ' + err); } 
      // (async () => {
        //listing all files using forEach
        files.forEach(function (file) {
          // Do whatever you want to do with the file
          let today = (fs.statSync(directoryPath + "/" + file).birthtime)
          let creationDate = today.getDate() + "/" + 
                            (today.getMonth() + 1) + "/" + 
                            today.getFullYear();
          let userEmail = file.split("#$#")[0];
          if(userEmail === currentUserLoggedIn){
            const temp = [file.split("#$#")[1], creationDate]
            perUserFiles.push(temp);
            // perUserFiles.push(file.split("#$#")[1]);
          }
        });
        // console.log("  array of user " + currentUserLoggedIn);
        // console.log(perUserFiles);
        
    // })();
    res.send(perUserFiles);
  });

});


app.listen(PORT, () => {
  console.log(`Server running successfully on ${PORT}`);
});


