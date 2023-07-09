import jwt from 'jsonwebtoken';

const generateToken = (res, username) => {
    const token = jwt.sign({ username }, process.env.SECRET_JWT, {
        expiresIn: '1d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 30 days
    });
};

export default generateToken;