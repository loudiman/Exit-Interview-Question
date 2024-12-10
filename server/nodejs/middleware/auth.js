const jwt = require('jsonwebtoken');
const secretKey = 'amalgam';

function authenticateToken(req, res, next) {
    console.log("Full Headers:", req.headers);
    console.log("Cookies:", req.cookies);  // Log all parsed cookies

    const authHeader = req.get('Authorization') || req.headers['authorization'];
    console.log("Authorization Header:", authHeader);

    let token = authHeader && authHeader.split('Bearer ')[1];

    // If no token in the header, check the cookie
    if (!token) {
        token = req.cookies.token;
        console.log("Token from cookie:", token);
    }

    console.log("Extracted Token:", token);

    if (!token) {
        console.log('No token provided');
        return res.status(401).send('Access denied: No token provided');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log('Token verification error:', err);
            return res.status(403).send('Invalid token');
        }
        console.log('Token verified successfully:', user);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
