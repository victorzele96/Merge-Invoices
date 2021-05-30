// import React, { useState } from "react";
// import axios from "axios";
import "../css/Upload.css"

function Upload() {
//   const [file, setFile] = useState();
//   const [fileName, setFileName] = useState("");
//   const [test, setTest] = useState("hello world !");


  const saveFile = (e) => {
//     setFile(e.target.files[0]);
//     setFileName(e.target.files[0].name);
  };

  // const uploadFile = async (e) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("fileName", fileName);
  //   axios.post(
  //       "http://localhost:3000/upload",
  //       formData
  //   )
  //   .then(res => {
  //       console.log(res);
  //   })
  //   .catch(err => {
  //       console.error(err);
  //   });
  // };

  // const componentDidMount = () => {
  //   axios.get("/newTestRow").then(response => {
  //     console.log(test)
  //     console.log("try1")
  //     setTest(response.data)
  //     console.log(test)
  //   });
  // };

  return (
    <div className="Upload">
      <input type="file" onChange={saveFile} />
      {/* <button onClick={componentDidMount}>Upload</button> */}
      {/* <button onClick={uploadFile}>Upload</button> */}
      <p> some:  {test} </p>
    </div>
  );
}

export default Upload;