const express = require('express');
const userController = require('../controllers/user-auth');
const { check, body } = require("express-validator");


const router = express.Router();

router.post('/Login', [
    check('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 5 }).withMessage('Invalid password').trim()
], userController.logIn);


router.get('/Home', (req, res) => {
    res.send('Home Page');
});

router.get("/getuser/:userId", userController.getUser);

module.exports = router;