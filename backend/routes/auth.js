const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get the Authorization header
    const authHeader = req.header('Authorization');

    // Check for the Authorization header and Bearer token format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    // Extract token from Authorization header
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired, please log in again.' });
            }
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // Log decoded token for debugging (consider removing this for production)
        if (process.env.NODE_ENV === 'development') {
            console.log('Decoded token:', decoded);
        }

        // Check if the decoded token contains the required fields
        if (!decoded || !decoded.id || !decoded.username) {
            console.log('Decoded token does not contain the expected structure:', decoded);
            return res.status(403).json({ message: 'Invalid token structure' });
        }

        // Attach user data to the request object for downstream handlers
        req.user = decoded;  // Store decoded data in the request

        // Proceed to the next middleware or route handler
        next();
    });
};

module.exports = { authenticateToken };
