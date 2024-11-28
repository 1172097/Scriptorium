import { verifyToken } from "./auth";

// Middleware to verify user authentication
// Made with the assistance of ChatGPT.

export function verifyUser(handler) {
    return async function(req, res) {
        try {
            // Attempt to verify the token
            const user = await verifyToken(req);

            // If token is valid, attach user to request and proceed
            if (user) {
                req.user = user; // Attach user info to request
                return handler(req, res); // Call the original handler
            } else {
                // If token is invalid, respond with 401 Unauthorized
                return res.status(401).json({ message: 'Access denied' });
            }
        } catch (error) {
            console.error("Error verifying user:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
}

export function verifyAdmin(handler) {
    return async function(req, res) {
        try {
            // Attempt to verify the token
            const user = await verifyToken(req);

            // Check if the user exists and has admin rights
            if (user && user.role === 'ADMIN') {
                req.user = user; // Attach user info to request
                return handler(req, res); // Call the original handler
            } else {
                // If user is not an admin, respond with 403 Forbidden
                return res.status(403).json({ message: 'Access denied' });
            }
        } catch (error) {
            console.error("Error verifying admin:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
}

export function attachUser(handler) {
    return async function(req, res) {
        // Attempt to verify the token and retrieve the user
        const user = await verifyToken(req); // This will retrieve the user if the token is valid or return null if not

        // Attach user to request
        req.user = user; // If token is valid, user will be the decoded token; otherwise, it will be null

        // Call the original handler regardless of whether the user is authenticated or not
        return handler(req, res); 
    };
}



