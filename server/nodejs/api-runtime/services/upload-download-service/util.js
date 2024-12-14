const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const ensureUploadsDir = () => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
};

// Set up Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure uploads directory exists and use absolute path
        const uploadDir = ensureUploadsDir();
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Use the username from the URL as the filename, and preserve the original file extension
        const username = req.params.username; // Retrieve username from URL params
        
        if (!username) {
            return cb(new Error('Username is required'), null);
        }

        const fileExtension = path.extname(file.originalname); // Get the file extension
        const filename = `${username}${fileExtension}`; // Set the filename
        
        console.log('Attempting to save file:', filename);
        cb(null, filename);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

// Initialize multer with the storage configuration
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

function findUserFile(username) {
    const uploadDir = path.join(__dirname, 'uploads'); // Define the uploads directory
    
    try {
        // Log the full search parameters
        console.log('Searching for file with username:', username);
        console.log('Searching in directory:', uploadDir);

        // Check if directory exists
        if (!fs.existsSync(uploadDir)) {
            console.error('Uploads directory does not exist');
            return null;
        }

        // Read directory contents
        const files = fs.readdirSync(uploadDir);
        console.log('Files in directory:', files);

        // Iterate through all files and check if any match the username (ignoring extensions)
        for (let file of files) {
            const fileNameWithoutExt = path.parse(file).name;  // Get the filename without extension
            
            // Log each file being checked
            console.log(`Checking file: ${file}, filename without ext: ${fileNameWithoutExt}`);
            
            // Use strict equality for comparison
            if (fileNameWithoutExt === username) {
                const fullFilePath = path.join(uploadDir, file);
                console.log('File found:', fullFilePath);
                return fullFilePath; // Return the full path of the file
            }
        }

        console.log('No matching file found for username');
    } catch (error) {
        console.error('Error searching for user file:', error);
    }
    
    return null; // Return null if no match is found
}
module.exports = { upload, findUserFile };