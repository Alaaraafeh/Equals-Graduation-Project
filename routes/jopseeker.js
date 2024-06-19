const express = require('express');
const jopseekerController = require('../controllers/jopseeker');
const jopseekerModel = require('../models/jopseeker');
const isAuth = require('../middleware/is-auth');
const { body } = require("express-validator");

const router = express.Router();

 //router.get("/Registration", jopseekerController.getNewUser);

router.post('/Registration', [
    // Validation for first name
    body('firstName').trim().not().isEmpty().withMessage('First name is required'),

    // Validation for last name
    body('lastName').trim().not().isEmpty().withMessage('Last name is required'),

    // Validation for mobile number
    body('mobileNumber')
        .trim()
        .not().isEmpty().withMessage('Mobile number is required')
        .isNumeric().withMessage('Mobile number must be numeric')
        .isLength({ min: 10 }).withMessage('Mobile number must be at least 10 digits'),

    // Validation for email
    body('email')
        .not().isEmpty().withMessage('Email address is required')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail()
        .custom(async (email) => {
            const findUser = await jopseekerModel.findOne({ email: email });
            if (findUser) {
                throw new Error('User already exists!');
            }
            return true;
        }),

    // Validation for confirming email
    body('confirmEmail')
        .normalizeEmail()
        .custom((value ,{ req }) => {
            if (value !== req.body.email){
                throw new Error('Emails do not match');
            }
            return true;
        }),

    // Validation for password
    body('password')
        .trim()
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),

    // Validation for confirming password
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password){
                throw new Error('Passwords do not match');
            }
            return true;
        })
], jopseekerController.postAddUser);


router.post("/CreateCv", isAuth, jopseekerController.createCv);

router.get("/Cv/:cvId", jopseekerController.getCv);

router.get('/cvs/:jobSeekerId', jopseekerController.getCvsForJobSeeker);

router.delete("/Delete/:cvId", jopseekerController.deleteCv);

router.post("/Edit/:cvId", jopseekerController.editCv);

router.post("/Recommendation/:cvId", jopseekerController.recommendJops);



module.exports = router;
