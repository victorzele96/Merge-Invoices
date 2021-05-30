const { admin, db } = require("./admin");
// Upload a pdf for user
exports.uploadFile = (req, res) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");
  
    const busboy = new BusBoy({ headers: req.headers });
  
    let fileToBeUploaded = {};
    let fileName;
  
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if (mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Wrong file type submitted" });
      }
      // my.file.pdf => ['my', 'file', 'pdf']
      const fileExtension = filename.split(".")[filename.split(".").length - 1];
      // 32756238461724837.png
      fileName = `${Math.round(
        Math.random() * 1000000000000
      ).toString()}.${fileExtension}`;
      const filepath = path.join(os.tmpdir(), fileName);
      fileToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });
  
//     let fileUrl = [];
//     db.doc(`/users/${req.user.handle}`).get()
//     .then((doc) => {
//       if (doc.exists) {
//         const userData = doc.data();
//         fileUrl = fileUrl.concat(userData.fileUrl);
//         return res.json({ fileUrl });
//       } else {
//         return res.status(404).json({ error: 'user not found' });
//       }
//     })
//     .catch(err => {
//       return res.json({ error: err.code });
//     });
  
    busboy.on("finish", () => {
      admin
        .storage()
        .bucket()
        .upload(fileToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: fileToBeUploaded.mimetype,
            },
          },
        })
        .then(() => {
          fileUrl = fileUrl.concat(`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${fileName}?alt=media`);
          return db.doc(`/users/${req.user.handle}`).update({ fileUrl });
        })
        .then(() => {
          return res.json({ message: "file uploaded successfully" });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: "something went wrong" });
        });
    });
    busboy.end(req.rawBody);
  };