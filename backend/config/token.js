import jwt from "jsonwebtoken";

/**
 * Function to generate a JWT token
 * @param {string} userId - The MongoDB unique ID of the user
 */
const genToken = async (userId) => {
    try {
        // Signing the token with the userId and secret key from .env
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "7d", // Token remains valid for 7 days
        });

        // Returning the generated token to be stored in the cookie
        return token;
    } catch (error) {
        console.log("JWT Generation Error:", error);
        return null;
    }
};

export default genToken;