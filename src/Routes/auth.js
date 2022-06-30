const express = require('express')

const router = express.Router()

const authController = require('../Controllers/auth')

// const { registerValidation,  } = require("../../validation")

// router.post('/register', (req, res) => {
//     const { error } = registerValidation(req.body)

//     if({error}) return res.status(400).send(error.details[0].message) 

//     const emailExist = await 
// })

router.post('/register', authController.register)

router.post('/login', authController.login)

router.get('/register', authController.getRegister)
    
// router.delete('/register/:postId', authController.deleteAcc)

module.exports = router