const express = require(`express`)
const {upload, findUserFile} = require(`./util`)
const fs = require('fs')
const path = require('path')
const uploadDownloadService = express.Router()

uploadDownloadService.post('/upload/image/:username',upload.single('file'), (req,res)=>{
    console.log(req.params.username)
    if(!req.file){
        res.status(400).json({message:"no file sent"})
    }
    res.status(200).json({message:"uploaded"})
})

uploadDownloadService.get(`/image/:filename`,(req, res) => {
    const username = req.params.filename;  // Get the username from the URL parameter
    const filePath = findUserFile(username);  // Try to find the file

    if (filePath) {
        // If the file is found, send it as a response
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(500).send('Error sending file');
            }
        });
    } else {
        // If no file is found, respond with a 404 error
        res.status(404).send('File not found');
    }
})

// File download route
uploadDownloadService.get('/download/image/:username', (req, res) => {
    const username = req.params.username;
    
    try {
        // Find the file path
        const filePath = findUserFile(username);

        if (!filePath) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File does not exist' });
        }

        // Get file extension and set appropriate content type
        const fileExtension = path.extname(filePath).toLowerCase();
        let contentType;

        switch (fileExtension) {
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.pdf':
                contentType = 'application/pdf';
                break;
            default:
                contentType = 'application/octet-stream';
        }

        // Set headers for file download
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        
        fileStream.pipe(res);

        fileStream.on('error', (error) => {
            console.error('File streaming error:', error);
            res.status(500).json({ message: 'Error streaming file' });
        });

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = uploadDownloadService