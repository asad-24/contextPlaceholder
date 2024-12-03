'use client'

// pages/index.js
import { useEffect, useState } from 'react';

const Home = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch the list of .txt files from the API route
    fetch('/api/files')
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error('Error fetching files:', error));
  }, []);

  return (
    <div>
      <h1>List of Text Files:</h1>
      <ul>
        {files.length === 0 ? (
          <li>No .txt files found</li>
        ) : (
          files.map((file, index) => (
            <li key={index}>{file}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Home;
