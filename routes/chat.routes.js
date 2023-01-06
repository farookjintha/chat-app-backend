const express = require('express');
const { isAuth } = require('../utils/authenication');

const router = express.Router();

router.get('/:userID/chat', isAuth, (req, res) => {
    res.send({message: "Welcome to Chat room."})
})

module.exports = router;