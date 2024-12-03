// pages/api/files.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const directoryPath = path.join(process.cwd(), 'public');  // Path to the 'public' folder

  // Read the files in the 'public' folder
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading files:", err);
      res.status(500).json({ message: 'Error reading files' });
      return;
    }

    // Filter only the .txt files (exclude directories)
    const txtFiles = files.filter(file => file.endsWith('.txt') && fs.lstatSync(path.join(directoryPath, file)).isFile());

    console.log('Files found:', txtFiles); // Logs the files to the server console

    res.status(200).json(txtFiles); // Send the list of .txt files to the frontend
  });
}
