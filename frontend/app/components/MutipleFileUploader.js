'use client';
import React, { useState, useEffect } from 'react';

const MultipleFileUploader = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('initial');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setStatus('initial');
      // Convert FileList to an array and merge with the previous files
      setFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(e.target.files),
      ]);
    }
  };

  const handleDelete = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  useEffect(() => {
    console.log(files);
  }, [files]);

  const handleUpload = async () => {
    if (files.length > 0) {
      setStatus('uploading');

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      try {
        // Uncomment and replace with actual endpoint for testing
        // const result = await fetch('https://your-api-endpoint.com/upload', {
        //   method: 'POST',
        //   body: formData,
        // });
        // const data = await result.json();
        // console.log(data);
        setStatus('success');
      } catch (error) {
        console.error(error);
        setStatus('fail');
      }
    }
  };

  return (
    <>
      <div className="input-group">
        <input id="file" type="file" multiple onChange={handleFileChange} />
      </div>

      {files.map((file, index) => (
        <section key={file.name}>
          <p>File number {index + 1} details:</p>
          <ul>
            <li>Name: {file.name} : <button onClick={() => handleDelete(file.name)}>Delete</button></li>
          </ul>
        </section>
      ))}

      {files.length > 0 && (
        <button onClick={handleUpload} className="submit">
          Upload {files.length > 1 ? 'files' : 'a file'}
        </button>
      )}

      <Result status={status} />
    </>
  );
};

const Result = ({ status }) => {
  if (status === 'success') {
    return <p>✅ File uploaded successfully!</p>;
  } else if (status === 'fail') {
    return <p>❌ File upload failed!</p>;
  } else if (status === 'uploading') {
    return <p>⏳ Uploading selected file...</p>;
  } else {
    return null;
  }
};

export default MultipleFileUploader;
