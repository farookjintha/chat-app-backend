const express = require('express');
const { requireSignin, isAuth } = require('../utils/authenication');

const router = express.Router();

router.get('/:userID/chat', requireSignin, isAuth, (req, res) => {
    res.send({message: "Welcome to Chat room."})
})

module.exports = router;