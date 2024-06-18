const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Jopseeker = require("../models/jopseeker");
const Employer = require("../models/employer");
const { validationResult } = require('express-validator');

// log in logic 
exports.logIn = async (req, res, next) => {
    try {
        const { email , password } = req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(422).json({ errors: errorMessages });
        }
        const findUser1 = await Jopseeker.findOne({ email });
        const findUser2 = await Employer.findOne({ email });
        let user;
        if (findUser1) {
            user = findUser1;
        } else if (findUser2) {
            user = findUser2;
        }
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        };
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch ) {
            const error = new Error('Wrong email or password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ email: user.email, userId: user._id.toString() }, "tokensecret", { expiresIn: '24h' });
        return res.status(200).json({ token: token, message: 'Logged in successfully' , loggedIn: true }); // user id also
    } catch (err) {
        console.log(err); 

        if (err.statusCode === 401) {
            return res.status(401).json({ message: err.message , loggedIn: false});
        } else {
            return res.status(500).json({ message: 'Something went wrong. Please try again later.',  loggedIn: false });
        }
    }
};

exports.getUser = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const findUser1 = await Jopseeker.findById(userId);
        const findUser2 = await Employer.findById(userId);
        let user;
        if (findUser1) {
            user = findUser1;
        } else if (findUser2) {
            user = findUser2;
        }
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        };
        res.status(200).json({ message: 'user fetched.', user: user });
    } catch (err) {
        next(err);
    }
}
 
