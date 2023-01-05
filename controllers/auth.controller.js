const express = require('express');
const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async(req, res) => {
    try{
        const payload = req.body;
        if(!payload.password){
            return res.status(400).send({message: 'Password is required.'})
        }
        const hashValue = await bcrypt.hash(payload.password, 10);

        payload.hashedPassword = hashValue;
        delete payload.password;

        let newUser = new Users(payload); //Validating the payload

        newUser.save((err, data) => {
            if(err){
                return res.status(400).send({message: 'Error while registering the user', error: err})
            }
            res.status(201).send({message: 'User has been registered successfully', userID: data._id});
        });
    }catch(error){
        res.status(500).send({message: 'Internal Server Error'});
    }
}

const signin = async (req, res) => {
    try{
        const {email, password} = req.body;
        const existingUser = await Users.findOne({email: email});
        
        if(existingUser){
            const isValidUser = await bcrypt.compare(password, existingUser.hashedPassword);

            if(isValidUser){
                const token = await jwt.sign({_id: existingUser._id}, process.env.SECRET_KEY);
                res.cookie('accessToken', token, {expire: new Date() + 86400000})

                return res.status(201).send({message: 'User signed-in successfully.'})
            }

            return res.status(401).send({message: 'Invalid credentials'})
        }

        res.status(400).send({message: 'User doesnot exist.'})

    }catch(error){
        console.log('Error: ', error)
        res.status(500).send({message: 'Internal Server Error', error: error});
        
    }
}

const signout = async (req, res) => {
    try{
        await res.clearCookie('accessToken');
        res.status(200).send({message: 'User signed out successfully.'})
    }catch(error){
        res.status(500).send({message: 'Internal Server Error'});
    }
}

module.exports = {register, signin, signout};