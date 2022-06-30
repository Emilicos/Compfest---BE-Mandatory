const express = require('express')
const {body} = require('express-validator')

const router = express.Router()

const productsController = require('../Controllers/products')

router.post('/post',productsController.createProduct)

router.get('/posts', productsController.getAllProducts)
// router.get('/posts?page=1&perPage=5', productsController.getAllProducts)

router.get('/post/:postId', productsController.getProductById)

router.put('/post/:postId', productsController.updateProductById)

router.delete('/post/:postId', productsController.deleteProductById)

// router.put('/products', (req, res, next) => {
//     res.json({name: 'Alvaro Austin', email: "notalvaroaustin@gmail.com"})
// })
// router.put('/products', (req, res, next) => {
//     res.json({name: 'Alvaro Austin', email: "notalvaroaustin@gmail.com"})
// })
module.exports = router