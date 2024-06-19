const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const Employer = require("../models/employer");
const Post = require("../models/post");
const { validationResult } = require('express-validator');
const { find } = require('../models/jopseeker');
const { post } = require('../routes/jopseeker');
const { uploadImageToCloudinary } = require('../util/uploadImage');
const mongoose = require("mongoose");
const axios = require("axios")


exports.getNewUser = async (req, res, next) => {
    res.status(200).json({ page: "employer registration page" })
};

exports.postAddUser = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const confirmEmail = req.body.confirmEmail;
    const mobileNumber = req.body.mobileNumber;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        //const errorMessages = errors.array().map(error => error.msg);
        return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
    }

    if (email !== confirmEmail) {
        const error = new Error('Email and confirmEmail do not match.');
        error.statusCode = 422;
        //error.data = errors.array();
        throw error;
    }

    // regestration logic
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const hashConfirmPassword = await bcrypt.hash(confirmPassword, 10);
        const user = new Employer({
            firstName: firstName,
            lastName: lastName,
            email: email,
            confirmEmail: confirmEmail,
            mobileNumber: mobileNumber,
            password: hashPassword,
            confirmPassword: hashConfirmPassword,
        });

        await user.save()
        res.status(201).json({ 
            massage: 'employer user added successfuly', 
            id: user._id,
            user: user
        });
        // res.redirect('/Home')
    } catch (err) {
        res.status(500).send("Something went wrong. Please try again later.");
    }
};


// post jops
exports.getPosts = async (req, res, next) => {
    try {
        const allPosts = await Post.find();
        if (allPosts.length > 0) {
            return res.status(200).json({
                message: "Fetched posts successfully",
                posts: allPosts   // jop title, location, jop type
            });
        } else {
            return res.status(200).json({
                message: "No posts found"
            });
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
   if (!errors.isEmpty()) {
        const error = new Error('Validation failed, the data is incorrect')
        error.statusCode = 422; // adding own custume property 
        throw error;
    }
    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }

    const postId = new mongoose.Types.ObjectId;
    const result = await uploadImageToCloudinary(req.file.path, postId, "postsimage")

    const {
        jobTitle, jobLocation, companyName,
        companyMail, jobDescription, category,
        jobType, salary, currency, timePeriod,
        companyWebsite, companyInfo
    } = req.body;

    const post = new Post({
        _id: postId,
        jobTitle: jobTitle,
        jobLocation: jobLocation,
        companyName: companyName,
        companyMail: companyMail,
        jobDescription: jobDescription,
        category: category,
        jobType: jobType,
        imageUrl: result.data,
        salary: salary,
        currency: currency,
        timePeriod: timePeriod,
        companyWebsite: companyWebsite,
        companyInfo: companyInfo,
        creator: { name: "alaa" }
    })
    try {
        await post.save()
        res.status(201).json({
            message: "Post created successfully!",
            post: post
        })
    } catch (err) {
        next(err);
    }

}

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        console.log(postId)
        const findPost = await Post.findById(postId);
        if (!findPost) {
            const error = new Error("not find post.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'post fetched.', post: findPost });
    } catch (err) {
        next(err);
    }
}


exports.editPost = async (req, res, next) => {
    const postId = req.params.postId;
    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    const result = await uploadImageToCloudinary(req.file.path, postId, "postsimage");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         const error = new Error('Validation failed, the data is incorrect')
         error.statusCode = 422;
         throw error;
     }

    try {
        const findPost = await Post.findById(postId);
        if (!findPost) {
            const error = new Error("not find post.");
            error.statusCode = 404;
            throw error;
        }

        findPost.jobTitle = req.body.jobTitle;
        findPost.jobLocation = req.body.jobLocation;
        findPost.companyName = req.body.companyName;
        findPost.companyMail = req.body.companyMail;
        findPost.jobDescription = req.body.jobDescription;
        findPost.category = req.body.category;
        findPost.jobType = req.body.jobType;
        findPost.imageUrl = result.data;
        findPost.salary = req.body.salary;
        findPost.currency = req.body.currency;
        findPost.timePeriod = req.body.timePeriod;
        findPost.companyWebsite = req.body.companyWebsite;
        findPost.companyInfo = req.body.companyInfo;
        findPost.creator = JSON.parse(req.body.creator);

        const updatedPost = await findPost.save();

        res.status(200).json({ message: 'post updated.', updatedPost });
    } catch (err) {
        next(err);
    }
};


exports.deletePost = async(req, res, next) => {
    const postId = req.params.postId;
    try{
        const findPost = await Post.findById(postId)
        if (!findPost) {
            const error = new Error("not find post.");
            error.statusCode = 404;
            throw error;
        }
        // check logged in user
        await Post.findByIdAndDelete(postId);
        res.status(200).json({massage: "Deleted post."})
    } catch (err) {
        next(err)
    }
}

exports.recommendCvs = async (req, res, next) => {
    const comparePayload = {
        //jobs_skills: req.body.jobsSkills  
        //employees_skills: req.body.employeeSkills,  

        jobs_skills: ["jobs"], // from front req.body.jobDescription 
        employees_skills: ["employee_1", "employee_2", "employee_3"] 
    };

    try {
        const response = await axios.post('https://zayanomar5-omarz.hf.space/compare', comparePayload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({
            message: "post compared successfully!",
            skillsComparison: response.data
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
