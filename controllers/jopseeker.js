const bcrypt = require('bcrypt');
const Jopseeker = require("../models/jopseeker");
const { validationResult } = require('express-validator');
const axios = require('axios');
const Cv = require("../models/cv");
const Post = require("../models/post");


exports.postAddUser = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const confirmEmail = req.body.confirmEmail;
    const mobileNumber = req.body.mobileNumber;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const disability = req.body.disability;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(422).json({ errors: errorMessages });
    }


    // validation
    if (!firstName || !lastName || !email || !confirmEmail || !mobileNumber || !password || !confirmPassword) {
        return res.status(400).send("Missing required data");
    }

    // regestration logic
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const hashConfirmPassword = await bcrypt.hash(confirmPassword, 10);
        const user = new Jopseeker({
            firstName: firstName,
            lastName: lastName,
            email: email,
            confirmEmail: confirmEmail,
            mobileNumber: mobileNumber,
            password: hashPassword,
            confirmPassword: hashConfirmPassword,
            disability: disability
        });
        await user.save()
        res.status(201).json({
            massage: 'jopseeker user added successfuly',
            userId: user._id,
            user: user
        });
        // fornt i think  res.redirect('/Home');

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong. Please try again later.");
    }
};


exports.createCv = async (req, res, next) => {
    const jobSeekerId = req.userId;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, the data is incorrect')
        error.statusCode = 422;
        throw error;
    }
    
    const cv = new Cv({
        jobSeeker: jobSeekerId,
        jobTitle: req.body.jobTitle,
        jobLocation: req.body.jobLocation,
        email: req.body.email,
        personalStatement: req.body.personalStatement,
        employmentHistory: req.body.employmentHistory,
        education: req.body.education,
        languages: req.body.languages,
        certifications: req.body.certifications,
        links: req.body.links,
        skills: req.body.skills,
        strength: req.body.strength
    });
    
    try {
        await cv.save()
        res.status(201).json({
            message: "CV created successfully!",
            cvId: cv._id,
        })
        
        //    cv_body: "I am a highly motivated and results-oriented software engineer with a strong work ethic and a proven track record of developing and maintaining high-quality software applications. I possess a unique blend of in Python, Java, web development, and machine learning. I am adept at designing, implementing, and testing software solutions to meet business requirements. I am confident that I can contribute to your team by developing innovative features, optimizing performance, and improving code quality."
        const Cv_body = {
            cv_body:`${cv.jobTitle} ${cv.jobLocation} ${cv.personalStatement.descPersonal} ${cv.skills.skill} ${cv.skills.experience} ${cv.employmentHistory.historyJobTitle}`
        }

        console.log("wating for analysis");
        const cv_body = JSON.stringify(Cv_body);

        const response = await axios.post('https://zayanomar5-omar.hf.space/cv', cv_body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // save in databas response.data
        cv.cvAnalysis = response.data;
        await cv.save();
        console.log("cv analysis successfully")

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.editCv = async (req, res, next) => {
    const cvId = req.params.cvId
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, the data is incorrect')
        error.statusCode = 422;
        throw error;
    }
    try {
        const findCv = await Cv.findById(cvId);
        if (!findCv) {
            const error = new Error("not find Cv.");
            error.statusCode = 404;
            throw error;
        }
        findCv.jobTitle = req.body.jobTitle;
        findCv.jobLocation = req.body.jobLocation;
        findCv.email = req.body.email;
        findCv.phoneNumber = req.body.phoneNumber;
        findCv.address = req.body.address;
        findCv.city = req.body.city;
        findCv.country = req.body.country;
        findCv.nationalty = req.body.nationalty;
        findCv.date = req.body.date;
        findCv.personalStatement = req.body.personalStatement;
        findCv.employmentHistory = req.body.employmentHistory;
        findCv.education = req.body.education;
        findCv.languages = req.body.languages;
        findCv.certifications = req.body.certifications;
        findCv.awards = req.body.awards;
        findCv.links = req.body.links;
        findCv.interests = req.body.interests;
        findCv.skills = req.body.skills;

        const updatedCv = await findCv.save();

        res.status(200).json({ message: 'Cv updated.', updatedCv });
    } catch (err) {
        next(err);
    }
};


exports.getCv = async (req, res, next) => {
    const cvId = req.params.cvId;
    try {
        const findCv = await Cv.findById(cvId);
        if (!findCv) {
            const error = new Error("not find cv.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'cv fetched.', post: findCv });
    } catch (err) {
        next(err);
    }
}


exports.getCvsForJobSeeker = async (req, res, next) => {
    const jobSeekerId = req.params.jobSeekerId; 
    try {
        const cvs = await Cv.find({ jobSeeker: jobSeekerId });
        
        if (!cvs) {
            const error = new Error('No CVs found for this job seeker.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({message: 'CV fetched successfully.', cv: cvs });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.deleteCv = async (req, res, next) => {
    const cvId = req.params.cvId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, the data is incorrect')
        error.statusCode = 422;
        throw error;
    }
    try {
        const findCv = await Cv.findById(cvId)
        if (!findCv) {
            const error = new Error("not find Cv");
            error.statusCode = 404;
            throw error;
        }
        await Cv.findByIdAndDelete(cvId);
        res.status(200).json({ massage: "Deleted Cv." })
    } catch (err) {
        next(err)
    }

}



exports.recommendJops = async (req, res, next) => {
    try {
      //  const jobSeekerId = req.userId; // Assuming the user ID is stored in the request
      //  const jobSeeker = await Jopseeker.findById(jobSeekerId);

      const cvId = req.params.cvId; // Assuming the user ID is stored in the request
      const cv = await Cv.findById(cvId);

        if (!cv) {
            const error = new Error('Job seeker not found.');
            error.statusCode = 404;
            throw error;
        }

        const cvAnalysis = cv.cvAnalysis.skills;
      //  const cvAnalysis = JSON.parse(jobSeeker.cvAnalysis);

        if (!cvAnalysis) {
            const error = new Error('CV analysis not found.');
            error.statusCode = 404;
            throw error;
        }

        const jobPosts = await Post.find({});
        if (!jobPosts.length) {
            const error = new Error('No job posts found.');
            error.statusCode = 404;
            throw error;
        }

        const jobPostsWithIds = jobPosts.map(jobPost => ({
            _id: jobPost._id,
            jobDescription: jobPost.jobDescription
        }));

        const allJobDescriptions = jobPosts.map(jobPost => jobPost.jobDescription);

        const comparePayload = {
            employee_skills: cvAnalysis,
            jobs_skills: allJobDescriptions
        };

        const response = await axios.post('https://zayanomar5-omar.hf.space/compare', comparePayload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({
            message: "Skills compared successfully!",
            skillsComparison: response.data,
            jobPosts: jobPostsWithIds
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};





// exports.recommendJops = async (req, res, next) => {
//     console.log(Jopseeker.cvAnalysis);

//     const jobPosts = await Post.find({});
//     const allJobDescriptions = jobPosts.map(jobPost => jobPost.jobDescription);
    
//     console.log(allJobDescriptions);
//     const comparePayload = {
//         //employee_skills: req.body.employeeSkills,  
//         //jobs_skills: req.body.jobsSkills  
//         employee_skills: Jopseeker.cvAnalysis,  //cv analysis
//         jobs_skills: allJobDescriptions //["Job skills list 1", "Job skills list 2", "..."]  // jop description
//     };

//     try {
//         const response = await axios.post('https://zayanomar5-omar.hf.space/compare', comparePayload, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         res.status(200).json({
//             message: "Skills compared successfully!",
//             skillsComparison: response.data
//         });
//     } catch (error) {
//         if (!error.statusCode) {
//             error.statusCode = 500;
//         }
//         next(error);
//     }
// };
