const express = require('express');
const { register, login, ForgetPassword, getMe, resetPassword, updateDetails, updatePassword, logout } = require('../controllers/auth');
const { protect, } = require('../middleware/auth')

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/me', protect, getMe);

router.post('/forgotpassword', ForgetPassword)

router.put('/resetpassword/:resettoken', resetPassword)

router.put('/updateDetails', protect, updateDetails)

router.put('/updatePassword', protect, updatePassword)

router.get('/logout', logout)



module.exports = router;





