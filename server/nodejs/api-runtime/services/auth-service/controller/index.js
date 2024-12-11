const crypto = require('crypto')
const secret = "amalgam"


function tokenAuthorizationV2(req, res) {
    const encryptedToken = req.query.token
    const token = decodeURIComponent(encryptedToken);

    // Split the token into hashed value and IV
    const [hashedValue, ivHex] = token.split(':');
    
    // Convert the IV from hex to buffer
    const iv = Buffer.from(ivHex, 'hex');

    // Create the key by hashing the secret
    const key = crypto.createHash('sha256').update(secret).digest();

    // Create the decipher instance with AES-256-CBC
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Decrypt the hashed value
    let decryptedValue = decipher.update(hashedValue, 'hex', 'utf8');
    decryptedValue += decipher.final('utf8');

    try {
        // Parse the decrypted value to an object (in case it's a JSON string)
        decryptedValue = JSON.parse(decryptedValue);
    } catch (error) {
        return res.status(400).json({ message: "Invalid Token" });
    }

    // Check if the id exists
    if (!decryptedValue.id) {
        return res.status(400).json({ message: "Invalid Token" });
    }

    return res.status(200).json({ message: "Authorized" });
}

// Function to generate a token (encryption)
function tokenGenerationV2(req, res) {
    const username = req.query.username

    const tokenJSON = { id: username }

    // Generate a random IV (Initialization Vector)
    const iv = crypto.randomBytes(16); // 16 bytes = 128 bits

    // Create a 32-byte key by hashing the secret (needed for AES-256)
    const key = crypto.createHash('sha256').update(secret).digest();

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Create a hashed value (you can use SHA-256)
    let hashedValue = cipher.update(JSON.stringify(tokenJSON), 'utf8', 'hex');
    hashedValue += cipher.final('hex');

    // Combine the IV and the hashed value
    const token = hashedValue + ':' + iv.toString('hex');

    res.status(200).json({token:encodeURIComponent(token)})
}

function tokenAuthorization(req, res){
    const token = req.query.token
    console.log(`API: Received token = ${token}`)

    console.log(`API: Stored Token ${req.session.token}`)
    if(!req.session.token){
        return res.status(401).json({message:"Unauthorized"})
    }

    console.log(!req.session.token == token)
    if(req.session.token !== token){
        return res.status(403).json({message:"Unauthorized"})
    }

    return res.status(200).json({message:"authorized"})
}

function tokenGeneration(req, res){
    var username = req.query.username

    var salt = username
    const generatedToken = crypto.createHmac('sha256', salt) // Use HMAC with the salt
    .update(username)
    .digest('hex'); // Generate the hash

    console.log(`Storing: ${generatedToken}`)
    req.session.token = generatedToken // saves the token in the session
    res.status(200).json({token:`${generatedToken}`})
}

module.exports = {tokenAuthorization, tokenGeneration, tokenGenerationV2, tokenAuthorizationV2}