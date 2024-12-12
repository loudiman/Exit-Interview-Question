const express = require(`express`)
const {upload, findUserFile} = require(`./util`)
const uploadDownloadService = express.Router()

uploadDownloadService.post('/upload/image/:username',upload.single('file'), (req,res)=>{
    if(!req.file){
        res.status(400).json({message:"no file sent"})
    }
    res.status(200).json({message:"uploaded"})
})

uploadDownloadService.get(`/image/:filename`,(req, res) => {
    const username = req.params.username;  // Get the username from the URL parameter
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

module.exports = uploadDownloadService