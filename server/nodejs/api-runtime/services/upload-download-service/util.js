const multer = require(`multer`)
const path = require('path')
const fs = require('fs')

// Set up Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination where you want to save the file
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Use the username from the URL as the filename, and preserve the original file extension
        const username = req.params.username; // Retrieve username from URL params
        const fileExtension = path.extname(file.originalname); // Get the file extension
        const filename = `${username}${fileExtension}`; // Set the filename
        cb(null, filename);
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Function to find the file based on username, ignoring file extension
function findUserFile(username) {
    const uploadDir = path.join(__dirname, 'uploads'); // Define the uploads directory
    const files = fs.readdirSync(uploadDir); // Get all files in the uploads directory

    // Iterate through all files and check if any match the username (ignoring extensions)
    for (let file of files) {
        const fileNameWithoutExt = path.parse(file).name;  // Get the filename without extension
        if (fileNameWithoutExt === username) {
            return path.join(uploadDir, file); // Return the full path of the file
        }
    }
    return null; // Return null if no match is found
}

module.exports = {upload, findUserFile}