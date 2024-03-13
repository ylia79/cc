const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Define storage using multer.diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploaded files
    const uploadFolder = 'uploads';

    // Create the folder if it doesn't exist (recursive: true handles nested folders)
    fs.mkdirSync(uploadFolder, { recursive: true });

    // Callback with the destination folder path
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    // Keep the original filename
    cb(null, file.originalname);
  },
});

// Configure Multer with the defined storage
const upload = multer({ storage: storage });

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  // Check if a file was uploaded
  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  // Process the uploaded file (e.g., save to database, perform actions)
  // ... (your file processing logic here)

  // Respond with success message
  res.json({ success: true, message: 'File uploaded successfully.' });
});

// File download route
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Send the file as a response
    res.sendFile(filePath);
  } else {
    // Respond with error message if file not found
    res.status(404).json({ success: false, message: 'File not found.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
