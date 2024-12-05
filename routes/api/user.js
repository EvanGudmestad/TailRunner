import express from 'express';

import debug from 'debug';
const debugUser = debug('app:User');

import Joi from 'joi';
import bcrypt from 'bcrypt';

import { validBody } from '../../middleware/validBody.js';

import { registerUser, getUserByEmail, findRoleByName } from '../../database.js';

import jwt from 'jsonwebtoken';

import { fetchRoles, mergePermissions } from '@merlin4/express-auth';

const router = express.Router();

//Schema for new users
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required()
});

async function issueAuthToken(user){
 

  const roles = await fetchRoles(user, role => findRoleByName(role));

  const permissions = mergePermissions(user, roles);
 // debugUser(permissions);
  const token = jwt.sign({_id:user._id,email: user.email, role:user.role, permissions:permissions}, process.env.JWT_SECRET, {expiresIn: '1h'});
  //debugUser(token);
  return token;
}

async function issueAuthCookie(res,token){
  const cookieOptions = {httpOnly:true, maxAge:1000*60*60, sameSite:'strict', secure:true};
  res.cookie('authToken', token, cookieOptions);
}

router.get('/', (req, res) => {
  res.json({message:'Get All Users Route Hit'});
});

router.post('/register', validBody(userSchema),async (req, res) => {
  debugUser(`Route Hit`);
  const user = req.body;
  let existingUser = null;
  try{
   existingUser = await getUserByEmail(user.email);
  }catch(e){
    debugUser(e);
    res.status(500).json({message: 'Error registering user'});
  }
  if(existingUser){
    return res.status(400).json({message: 'User\'s email already exists'});
  }else{

  user.password = await bcrypt.hash(user.password, 10);
  user.role = ['customer'];  
  const insertUserResult = await registerUser(user);

  if(insertUserResult.acknowledged){
    //Generate JWT
    const jwtToken = await issueAuthToken(user);

    //Create Auth Cookie
    await issueAuthCookie(res, jwtToken);
    res.status(201).json({message: 'User registered successfully', role: user.role, email: user.email});
  }else{
    res.status(500).json({message: 'Error registering user'});
  }
} 
});

router.post('/login', validBody(userSchema), async (req, res) => {

  const user = req.body;

  try{
      const existingUser = await getUserByEmail(user.email);
      if(!existingUser){
        return res.status(200).json({message: 'Invalid email or password'});
      }
      const passwordMatch = await bcrypt.compare(user.password, existingUser.password);
      if(!passwordMatch){
        return res.status(200).json({message: 'Invalid email or password'});
      }
      const jwtToken = await issueAuthToken(existingUser);
      await issueAuthCookie(res, jwtToken);
      res.status(200).json(
        {
          message: 'User logged in successfully',
          role: existingUser.role,
          email: existingUser.email
        });
    }catch(e){
      debugUser(e);
      res.status(500).json({message: 'Error logging in user'});
    }
});

router.post('/logout', (req, res) => {

  res.clearCookie('authToken');
  res.status(200).json({message: 'User logged out successfully'});
});

//To DO: Implement Change Password Route




export {router as userRouter};