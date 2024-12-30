import React, { useState } from 'react';

const MultipleFileUploader = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('initial');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setStatus('initial');
      setFiles(Array.from(e.target.files)); // Convert FileList to an array
    }
  };

  const handleUpload = async () => {
    if (files.length > 0) {
      setStatus('uploading');

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      try {
        const result = await fetch('https://httpbin.org/post', {
          method: 'POST',
          body: formData,
        });

        const data = await result.json();

        console.log(data);
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
          File number {index + 1} details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      ))}

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          className="submit"
        >
          Upload {files.length > 1 ? 'files' : 'a file'}
        </button>
      )}

      <Result status={status}/>
    </>
  );
};

const Result = ({ status }) => {
  if (status === 'success') {
    return <p>👌 File uploaded successfully!</p>;
  } else if (status === 'fail') {
    return <p>❌ File upload failed!</p>;
  } else if (status === 'uploading') {
    return <p>⏳ Uploading selected file...</p>;
  } else {
    return null;
  }
};

export default MultipleFileUploader;
