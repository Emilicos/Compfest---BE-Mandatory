const {validationResult} = require('express-validator') 
const ProductPost = require('../models/products')
const path = require('path')
const fs = require('fs')

exports.createProduct = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const err = new Error("Invalid Value")
        err.errorStatus = 400;
        err.data = errors.array()
        throw err
    }

    if(!req.file){
        const err = new Error("Image needed to be uploaded")
        err.errorStatus = 422;
        throw err
    }

    const name = req.body.name
    const desc = req.body.desc
    const price = req.body.price
    const image = req.file.path

    const Posting = new ProductPost({
        name: name,
        desc: desc,
        price: price, 
        image: image,
    })

    Posting.save()

    .then((result) => {
        res.status(201).json
        (
            {
                message: "Create product success",
                data: result,
            }
        )
    })
    .catch(err => {
        console.log('err: ', err)
    })
}

exports.getAllProducts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalData;
    ProductPost.find().countDocuments()
    .then((sum) =>{ 
        totalData = sum
        return ProductPost.find()
        .skip((parseInt(currentPage-1))*parseInt(perPage)) // Jadi misal kalo perPage 5 berarti awal2 currentpage = 1 maka page ke 0(0-5), lalu page ke 1(6-10), page ke 2(11-15), dll.
        .limit(parseInt(perPage))
    })
    .then(result => {
        res.status(200).json({
            message: "Data berhasil didapatkan",
            data: result,
            total_data: totalData,
            per_page: perPage,
            current_page: currentPage,
        })
    })
    .catch((error) => next(error))

    // ProductPost.find()
    // .then(result => {
    //     res.status(200).json({
    //         message: "Data berhasil didapatkan",
    //         data: result,
    //     })
    // })
    // .catch(err => next(err))
}

exports.getProductById = (req, res, next) => {
    const postId = req.params.postId
    ProductPost.findById(postId)
    .then(result => {
        if(!result){
            const error = new Error("Data tidak ditemukan")
            error.errorStatus = 404;
            throw error
        }
        res.status(200).json({
            message: "Data dengan id berhasil didapatkan",
            data: result,
        })
    })
    .catch(err => next(err))
}

exports.updateProductById = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const err = new Error("Invalid Value")
        err.errorStatus = 400;
        err.data = errors.array()
        throw err
    }

    if(!req.file){
        const err = new Error("Image needed to be uploaded")
        err.errorStatus = 422;
        throw err
    }

    const name = req.body.name
    const desc = req.body.desc
    const price = req.body.price
    const image = req.file.path
    const postId = req.params.postId

    ProductPost.findById(postId)

    .then(result => {
        if(!result){
            const error = new Error("Data tidak ditemukan")
            error.errorStatus = 404;
            throw error
        }
        result.name = name
        result.price = price
        result.image = image
        result.desc = desc

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

exports.deleteProductById = (req, res, next) => {
    const postId = req.params.postId
    ProductPost.findById(postId)
    .then(result => {
        if(!result){
            const error = new Error("Data tidak ditemukan")
            error.errorStatus = 404;
            throw error
        }

        removeImage(result.image)
        return ProductPost.findByIdAndRemove(postId)
    })
    .then(result => {
        res.status(200).json({
            message: "Delete data berhasil",
            data: result,
        })
    })
    .catch(error => next(error))
}

const removeImage = (filePath) => {
    // console.log('filePath', filePath)
    // console.log('dirname', __dirname)
    filePath = path.join(__dirname, '../..', filePath)
    fs.unlink(filePath, err => console.log("error", err)) 
}  