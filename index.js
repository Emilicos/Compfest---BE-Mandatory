const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const dotenv = require('dotenv')

const app = express();
const productRoutes = require("./src/Routes/products")
const authRoutes = require("./src/Routes/auth")
const balanceRoutes = require("./src/Routes/balance")
dotenv.config();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/v1/product', productRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/balance', balanceRoutes);

app.use((error, req, res, next) => {
    const status = error.errorStatus || 500
    const message = error.message
    const data = error.data
    res.status(status).json({
        message: message,
        data: data,
    })
})

mongoose.connect(process.env.DB_CONNECT, console.log("berhasil masuk ke dbbb"))

.then(() => {
    app.listen(4000, () => console.log("success"))
})
.catch(err => console.log(err));