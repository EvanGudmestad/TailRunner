import express from 'express';
import { GetAllPetOwners, GetPetOwnerById, addPetOwner, updatePetOwner, deletePetOwner, saveAuditLog } from '../../database.js';
import { validId } from '../../middleware/validId.js';

import { isLoggedIn, hasPermission } from '@merlin4/express-auth';
import Joi from 'joi';
import { validBody } from '../../middleware/validBody.js';
import debug from 'debug';

const debugDogOwner = debug('app:DogOwner');

const router = express.Router();


const updatePetOwnerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dogs: Joi.array().items(Joi.string().allow('')).required(),
  _id: Joi.string().required()
});
//Get all Pet Owners
router.get('',hasPermission('canViewData'),async (req, res) => {
 
  let match = {};

  let {keywords, classification, sortBy, active, minAge, maxAge} = req.query;

 // debugDogOwner(`Keywords are ${keywords}`);

  if(keywords){
    match.$text = {$search: keywords};
  }

  if(classification){
    match.classification = {$eq: classification};
  }

  
  const today = new Date(); // Get current date and time
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0); // Remove time from Date

  const pastMaximumDaysOld = new Date(today);
  pastMaximumDaysOld.setDate(pastMaximumDaysOld.getDate() - maxAge); // Set pastMaximumDaysOld to today minus maxAge

  const pastMinimumDaysOld = new Date(today);
  pastMinimumDaysOld.setDate(pastMinimumDaysOld.getDate() - minAge); // Set pastMinimumDaysOld to today minus minAge

  
  if(maxAge && minAge){
    match.createdOn = {$lte:pastMinimumDaysOld, $gte:pastMaximumDaysOld};
  } else if(minAge){
    match.createdOn = {$lte:pastMinimumDaysOld};
  } else if(maxAge) {
    match.createdOn = {$gte:pastMaximumDaysOld};
  }

  if(active == 'true'){
    match.active = {$eq: true};
  }else if(active == 'false'){
    match.active = {$eq: false};
  }

  let sort = {lastName: 1};

  switch(sortBy){
    case 'firstName':
      sort = {firstName: 1};
      break;
    case 'lastName':
      sort = {lastName: 1};
      break;
    case 'classification':
      sort = {classification: 1};
      break;
    default:
      sort = {lastName: 1};
  }

  const pipeline = [
    {$match: match},
    {$sort: sort}
  ];

  try{
    const owners = await GetAllPetOwners(pipeline);
    res.status(200).json(owners);
  }catch(error){
    debugDogOwner(error);
  };

});

//Get Pet Owner by ID
router.get('/:id', validId('id'),async (req, res) => {
 const id = req.id;
  try{
    const owner = await GetPetOwnerById(id);
    //debugDogOwner(JSON.stringify(owner));
    if(JSON.stringify(owner) === '{}' || owner === null){
      res.status(404).send('Owner not found');
    }else{
      res.status(200).json(owner);
    }
  }catch(error){
    res.status(500).send(error);
  }});

//Add Pet Owner
router.post('', isLoggedIn(), async (req,res)=>{
  const owner = req.body;
  if(!owner || !owner.firstName || !owner.lastName || !owner.dogs){
    res.status(400).json({message:'Invalid request'});
  }
  else{
    try{
      owner.createdOn = new Date();
      const result = await addPetOwner(owner);
      const log = {
        timestamp: new Date(),
        operation: 'Add',
        collection: 'PetOwners',
        authorizedBy: req.auth.email,
      }
      await saveAuditLog(log);
      res.status(201).json({message:'New Owner Added'});
    }catch(error){
      res.status(500).send(error);
    }
  }
});

//Update Pet Owner
router.patch('/:id', validId('id'), validBody(updatePetOwnerSchema), hasPermission('canEditPetOwners'), async (req,res)=>{
  debugDogOwner(`The req.body is ${JSON.stringify(req.body)}`);
  const id = req.id;
  //debugDogOwner(id);
  //debugDogOwner(JSON.stringify(req.body));
  //Get the Current owner out of the DB
  const currentOwner = await GetPetOwnerById(id);
  //debugDogOwner(JSON.stringify(currentOwner));
  currentOwner.dogs = [];
  if(JSON.stringify(currentOwner) === '{}' || currentOwner === null){
    res.status(404).send('Owner not found');
  }else{
    const updatedOwner = req.body;
   // debugDogOwner(JSON.stringify(`Updated Owner Object: ${updatedOwner}`));
    if(updatedOwner.dogs){
      //if dogs is an array
      if(Array.isArray(updatedOwner.dogs)){
        updatedOwner.dogs.forEach((dog)=>{
          currentOwner.dogs.push(dog);
        });
      }else{
        //if dogs is a string
        currentOwner.dogs.push(updatedOwner.dogs);
      }      
    }

    if(updatedOwner.firstName){
      currentOwner.firstName = updatedOwner.firstName;
    }

    if(updatedOwner.lastName){
      currentOwner.lastName = updatedOwner.lastName;
    }
    
    //Update the owner in the DB
    try{
      const result = await updatePetOwner(currentOwner);
      const log = {
        timestamp: new Date(),
        operation: 'Edit',
        change: JSON.stringify(updatedOwner),
        collection: 'PetOwners',
        authorizedBy: req.auth.email,
      }
      await saveAuditLog(log);
      res.status(200).json({message:'Owner Updated'});
    }catch(error){
      res.status(500).send(error);
    }
  }
});

//Delete Pet Owner
router.delete('/:id', async (req,res)=>{
  const id = req.params.id;
  try{
    const result = await deletePetOwner(id);
    if(result.deletedCount === 0){
      res.status(404).send('Owner not found');
    }else{
      res.status(200).json({message:'Owner Deleted'});
    }
  }catch(error){
    res.status(500).send(error);
}});

//Add Item to Wish List
router.post('/:userId/wishList/:wishListId', validId('userId'), validId('wishListId'), async (req,res)=>{
 
  const userId = req.userId;
  const wishListId = req.wishListId;
  const {item} = req.body;
  try{
    const currentOwner = await GetPetOwnerById(userId);
    //debugDogOwner(JSON.stringify(currentOwner));
    if(JSON.stringify(currentOwner) === '{}' || currentOwner === null){
      res.status(404).send('Owner not found');
    }else{
      currentOwner.wishList.find(item => item._id.equals(wishListId)).items.push(item);
      const result = await updatePetOwner(currentOwner);
      res.status(200).json({message:'Wish List Updated'});
    }
  }catch(error){
    res.status(500).send(error);
  }

});

//Get Wish List
router.get('/:userId/wishList', async (req,res)=>{

});


export {router as dogOwnerRouter};