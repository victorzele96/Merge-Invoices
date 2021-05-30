import React, { useState, useEffect } from 'react'
// import { useAuth } from "../contexts/AuthContext"
import axios from 'axios'

//MUI stuff
import Grid from '@material-ui/core/Grid'
// import Button from '@material-ui/core/Button'
import BackspaceIcon from '@material-ui/icons/Backspace'
import IconButton from '@material-ui/core/IconButton'

//Document css file
import "../css/Dashboard.css"

export default function Document() {

  const [files, setFiles] = useState([])


    let data = axios.post("http://localhost:9000/view").then(response => {
      // console.log("res in document page");
      return response.data;
    }, (error) => {
      console.log(error);
    });
    
    useEffect(() => {
      data.then((user) => {
        user.forEach((item, index) => {
          // console.log("item =>" +item + "   index=>" + index);
          var arr = [];
          arr.push(item[0]);
          arr.push(index);
          arr.push(item[1]);
          const newFile = arr;
          setFiles(prevState => [...prevState, newFile]);
        });
      });
    }, [])

  const Delete = fileName => {
    // const fileName = files[fileName][0];
    setFiles(files.filter((file) => file[0] !== fileName))
    // req for each file that want to delete send file name and use fs.unlink
    console.log("file name =>" + fileName + " index =>" + fileName);
    deleteFileByFileName(fileName);
  }

  const deleteFileByFileName = async (e) => {
    const formData = new FormData();
    formData.append("fileName", e);
    try {
      const res = await axios.post(
        "http://localhost:9000/deleteFile",
        formData
      );
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  };

  {/* file[0] file name  */}
  {/* file[1] id (index number) */}
  {/* file[2] file creation date (upload date) */}


  return (
    <>
      <Grid container className="form">
          <Grid item sm/>
          <Grid item sm>
              <div className="table-container">
                <br/><br/><br/><br/>
                <div className="table-holder">
                  <table className="fixed_headers_document">
                      <thead>
                      <tr>
                          <th>File Name</th>
                          <th>Upload Date</th>
                          <th>Delete</th>
                      </tr>
                      </thead>
                      <tbody>
                        {files.map((file) =>
                          <tr className="active-row" key={file[1]}>
                            <td>{file[0]}</td> 
                            <td>{file[2]}</td> 
                            <td>
                              <IconButton onClick={() => Delete(file[0])}> 
                                <BackspaceIcon />
                              </IconButton>
                            </td>
                          </tr>
                        )} 
                      </tbody>
                  </table>
                  </div>
              </div>
          </Grid>
          <Grid item sm/>
      </Grid>
    </>
)}