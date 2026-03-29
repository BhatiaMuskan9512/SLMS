import jwt from "jsonwebtoken";

/**
 * Authentication Middleware
 * Checks if the user has a valid token in their cookies
 */
const isAuth = async (req, res, next) => {
    try {
        // 1. Extract the token from the cookies
        const { token } = req.cookies;

        // 2. If no token is found, return an error
        if (!token) {
            return res.status(401).json({ 
                message: "User does not have token" 
            });
        }

        // 3. Verify the token using the secret key from .env
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

        // 4. If verification fails
        if (!verifyToken) {
            return res.status(401).json({ 
                message: "User does not have valid token" 
            });
        }

        // 5. Attach the userId (from the token payload) to the request object
        // This allows subsequent controllers to use 'req.userId'
        req.userId = verifyToken.userId;

        // 6. Move to the next middleware or controller
        next();

    } catch (error) {
        return res.status(500).json({ 
            message: `isAuth Error: ${error.message}` 
        });
    }
};

export default isAuth;