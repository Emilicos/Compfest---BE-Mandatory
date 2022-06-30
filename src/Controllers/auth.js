const {validationResult} = require('express-validator')
const UserPost = require('../Models/user')
const bcrypt = require('bcryptjs')
const { loginValidation, registerValidation,  } = require("../../validation")
const jwt = require('jsonwebtoken')

exports.register = async (req, res, next) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const err = new Error("Invalid Value")
        err.errorStatus = 400;
        err.data = errors.array()
        console.log("error")
        throw err
    }

    const { error } = registerValidation(req.body)

    if( error ){ 
        return res.status(400).send(error.details[0].message)
    } 

    const studentIdExist = await UserPost.findOne({studentId: req.body.studentId})

    console.log(studentIdExist)
    if(studentIdExist){ 
        return res.status(400).send("Student ID already exist")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const name = req.body.name
    const studentId = req.body.studentId
    const password = hashedPassword

    const Posting = new UserPost({
        name: name,
        studentId: studentId,
        password: password,
    })

    Posting.save()

    .then((result) => {
        res.status(201).json({
            "message": "Berhasil membuat Akun",
            "data": result,
        })
    })
    .catch((error) =>{
        res.status(400).json({
            "message": "Failed to make account",
        })
    })
}

exports.login = async (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const err = new Error("Invalid Value")
        err.errorStatus = 400;
        err.data = errors.array()
        console.log("error")
        throw err
    }

    const { error } = loginValidation(req.body)

    if( error ) {
        return res.status(400).send(error.details[0].message)
    } 

    const user = await UserPost.findOne({studentId: req.body.studentId})

    if(!user){ 
        return res.status(400).json({
            "Message": "Student ID not found",
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if(!validPassword){
        return res.status(400).json({
            "Message": "Invalid Password", 
        })
    }

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token)
    
    res.status(201).json({
        "message": "Login successful",
        "name": user.name,
        "token": token,    
    })
    // res.status(200).json({
    //     "Message": "Login successful", 
    // })
}

exports.getRegister = (req, res, next) => {
    UserPost.find()
    .then(result => {
        res.status(200).json({
            message: "Data berhasil didapatkan",
            data: result,
        })
    })
    
    .catch(err => next(err))

}

// exports.deleteAcc = (req, res, next) => {
//     const postId = req.params.postId
//     UserPost.findById(postId)
//     .then(result => {
//         if(!result){
//             const error = new Error("Data tidak ditemukan")
//             error.errorStatus = 404;
//             throw error
//         }

//         return UserPost.findByIdAndRemove(postId)
//     })
//     .then(result => {
//         res.status(200).json({
//             message: "Delete data berhasil",
//             data: result,
//         })
//     })
//     .catch(error => next(error))
// }