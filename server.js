const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());

const googleAuth = new google.auth.GoogleAuth({
  keyFile: 'path/to/your/credentials.json', // Replace with your key file path
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth: googleAuth });

// Endpoint for uploading files
app.post('/upload', async (req, res) => {
  try {
    const { filePath, googleDriveFolderId } = req.body;
    // Assume file is available on the server or handle file transfer from client to server
    const fileMetadata = {
      name: filePath,
      parents: [googleDriveFolderId],
    };
    const media = {
      body: fs.createReadStream(filePath),
    };
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    res.status(200).json({ success: true, fileId: response.data.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
