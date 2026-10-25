
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    // Check whether the secret exists without revealing it
    // console.log(
    //     'JWT_SECRET loaded:',
    //     Boolean(process.env.JWT_SECRET)
    // );

    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

export default generateToken;
