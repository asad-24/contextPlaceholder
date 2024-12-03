'use client';

import { useEffect, useState } from 'react';

const Main = () => {
  const [files, setFiles] = useState([]); // Store the list of files
  const [selectedFile, setSelectedFile] = useState(""); // Store the selected file name
  const [fileContent, setFileContent] = useState(""); // File content
  const [variables, setVariables] = useState([]); // Variables in the file

  // Handle file selection
  const handleFileSelection = (event) => {
    const fileName = event.target.value;
    setSelectedFile(fileName);
    fetchFileContent(fileName);
  };

  // Fetch file content
  const fetchFileContent = async (fileName) => {
    try {
      const response = await fetch(`/public/${fileName}`);
      const text = await response.text();
      
      // Extract variables wrapped in {{ }}
      const extractedVariables = [...text.matchAll(/{{(.*?)}}/g)].map(
        (match, index) => ({
          id: index + 1,
          key: match[1].trim(),
          value: "",
        })
      );

      setFileContent(text);
      setVariables(extractedVariables);
    } catch (error) {
      console.error("Error fetching the file:", error);
    }
  };

  // Fetch the list of files when the component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/pages/api/files.js');
        const fileList = await response.json();
        console.log('Files fetched:', fileList); // Add logging to check fetched files
        setFiles(fileList);
        
        if (fileList.length > 0) {
          setSelectedFile(fileList[0]); // Set default selected file
          fetchFileContent(fileList[0]); // Load content of the first file
        }
      } catch (error) {
        console.error("Error fetching file list:", error);
      }
    };

    fetchFiles();
  }, []);


  // Copy updated file content to clipboard
  const copyUpdatedFile = () => {
    const updatedContent = getUpdatedFileContent();
    navigator.clipboard.writeText(updatedContent).then(() => {
      alert("Updated file content copied to clipboard!");
    });
  };
    // Clear all input fields
    const clearFields = () => {
      setVariables(variables.map((variable) => ({ ...variable, value: "" })));
    };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-4">File Content</h1>
        <pre className="whitespace-pre-wrap">{fileContent}</pre>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-gray-200 p-6">
        {/* File Selection */}
        <div className="mb-4">
          <label htmlFor="file-select" className="block text-lg font-semibold mb-2">
            Select a File:
          </label>
          <select
            id="file-select"
            value={selectedFile}
            onChange={handleFileSelection}
            className="border p-2 rounded w-full"
          >
            {files.map((file, index) => (
              <option key={index} value={file}>
                {file}
              </option>
            ))}
          </select>
        </div>

        {/* Table Structure for Variables */}
        <table className="table-auto w-full mb-4 border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Variable-Key</th>
              <th className="px-4 py-2 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {variables.map((variable) => (
              <tr key={variable.id} className="border-b">
                <td className="px-4 py-2">{variable.id}</td>
                <td className="px-4 py-2">{variable.key}</td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder={`Enter ${variable.key}`}
                    value={variable.value}
                    onChange={(e) => handleInputChange(variable.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={copyUpdatedFile}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Copy Updated File
          </button>
          <button
            onClick={clearFields}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
