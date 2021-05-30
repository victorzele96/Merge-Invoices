import React, { useState } from 'react'
import { useAuth } from "../contexts/AuthContext"
import axios from 'axios'

//MUI stuff
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import BackspaceIcon from '@material-ui/icons/Backspace'
// import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

//Dashboard css file
import "../css/Dashboard.css"

export default function Dashboard() {
  // const [error, setError] = useState("")
  const { currentUser } = useAuth() // , logout
  const [files, setFiles] = useState([])
  const [tempFiles, setTempFiles] = useState([])

  const formDataUser = new FormData();
  formDataUser.append("email", currentUser.email);
  try {
    const res = axios.post(
      "http://localhost:9000/currentUser",
      formDataUser
    );
    console.log(res);
  } catch (ex) {
    console.log(ex);
  }

  const onFileChange = e => {
    let today = new Date(),
    date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      newFile["id"] = Math.random();
      newFile["date"] = date;
      // add an "id" property to each File object
      setFiles(prevState => [...prevState, newFile]);
      setTempFiles(prevState => [...prevState, newFile]);
    }
  };
  
  const uploadAllFiles = async (e) => {
    for (let i = 0; i < files.length; i++){
      uploadFile(files[i]);
    };
    setFiles([]);
    setTempFiles([]);
  }

  const uploadFile = async (oneFile) => {
      const formData = new FormData();
      formData.append("file", oneFile);
      formData.append("fileName", oneFile.name);
      formData.append("email", currentUser.email);
      try {
        const res = await axios.post(
          "http://localhost:9000/upload",
          formData
        );
        console.log(res);
      } catch (ex) {
        console.log(ex);
      }
  };

  // const sendNow = async (e) => {
  //   const formData = new FormData();
  //   formData.append("allFiles", files);
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:9000/send",
  //       formData
  //     );
  //     console.log(res);
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // };

  const Delete = fileId => {
    setFiles(files.filter((file) => file.id !== fileId))
    setTempFiles(files.filter((file) => file.id !== fileId))
  }

  return (
    <>
      <Grid container className="form">
          <Grid item sm/>
          <Grid item sm>
            <div className="file-wrapper">
              <input 
                type="file" 
                className="file"
                id="pdf-files" 
                name="pdf-files" 
                accept=".pdf,.doc" 
                multiple
                onChange={onFileChange}
              />  
              <p>Drag your files here or click here</p>
            </div>
              <div className="table-container">
                <Button 
                  startIcon={<CloudUploadIcon/>}
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  // disabled
                  className="button"
                  onClick={uploadAllFiles}
                >
                  Upload
                </Button>

                {/* <Button 
                  style={{ marginTop: '15px' }}
                  endIcon={<SendIcon/>}
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  // disabled
                  className="button"
                  onClick={sendNow}
                >
                  Send Now 
                </Button> */}
                
                <br/><br/><br/><br/>
                <div className="table-holder">
                  <table className="fixed_headers">
                      <thead>
                      <tr>
                          <th>File Name</th>
                          <th>Upload Date</th>
                          <th>Delete</th>
                      </tr>
                      </thead>
                      <tbody>
                        {tempFiles.map((file) => 
                          <tr className="active-row" key={file.id} >
                            <td>{file.name}</td>
                            <td>{file.date}</td>
                            <td>
                              <IconButton onClick={() => Delete(file.id)} >
                                <BackspaceIcon/>
                              </IconButton>
                            </td>
                          </tr>
                        )}
                      </tbody>
                  </table>
                  </div>
                  <br/><br/><br/><br/><br/><br/><br/>
              </div>
          </Grid>
          <Grid item sm/>
      </Grid>
    </>
)}