
const admin = (req, res, next) => {
    
    
    //  Check whether a user exists and their role is "admin"
    if (req.user && req.user.role === "admin") {
        
        
        //  If the user is an admin, allow them to continue
        return next();
    }

    
    //  If the user is not an admin, deny access
    return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
    });
};


//  Export the middleware so other files can use it

export default admin;
