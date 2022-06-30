const express = require('express')

const router = express.Router()

const balanceController = require('../Controllers/balance')

router.get('/', balanceController.getBalance)

router.put('/', balanceController.updateBalance)

// router.delete('/:postId', balanceController.deleteBalance)

module.exports = router