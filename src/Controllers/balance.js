const {validationResult} = require('express-validator') 
const BalancePost = require('../models/balance')

exports.getBalance = (req, res, next) => {
    
    BalancePost.findOne()
    .then(result => {
        if(!result){
            const Posting = new BalancePost({
                balance: 0,
            })
            return Posting.save()
        }
    })

    BalancePost.find()
    .then(result => {
        res.status(200).json({
            message: "Data berhasil didapatkan",
            data: result,
        })
    })
    
    .catch(err => next(err))

}

exports.updateBalance = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const err = new Error("Invalid Value")
        err.errorStatus = 400;
        err.data = errors.array()
        throw err
    }

    const balance = req.body.balance

    BalancePost.findOne()
    
    .then(result => {
        if(!result){
            const error = new Error("Data tidak ditemukan")
            error.errorStatus = 404;
            throw error
        }

        result.balance = balance

        return result.save()
    })
    .then(result =>{
        res.status(200).json({
            message: "Data berhasil diubah",
            data: result,
        })
    })
    .catch(err => next(err))
}

// exports.deleteBalance = (req, res, next) => {
//     const postId = req.params.postId
//     BalancePost.findById(postId)
//     .then(result => {
//         if(!result){
//             const error = new Error("Data tidak ditemukan")
//             error.errorStatus = 404;
//             throw error
//         }

//         return BalancePost.findByIdAndRemove(postId)
//     })
//     .then(result => {
//         res.status(200).json({
//             message: "Delete data berhasil",
//             data: result,
//         })
//     })
//     .catch(error => next(error))
// }