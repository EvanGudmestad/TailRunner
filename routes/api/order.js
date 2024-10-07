import express from 'express';
import { ObjectId } from 'mongodb';
import {GetPetOwnerById,getOrderById,addOrder, updatePetOwner} from '../../database.js';

import debug from 'debug';
const debugOrder = debug('app:Order');

const router = express.Router();

router.get('/:ownerId', async (req, res) => {
  const ownerId = req.params.ownerId;
  try{
    const owner = await GetPetOwnerById(ownerId);
    //debugOrder(JSON.stringify(owner));
    if(JSON.stringify(owner) === '{}' || owner === null){
      res.status(404).send('Owner not found');
    }else{
      
      let userOrders=[]; 
      
     //debugOrder(JSON.stringify(owner.orders.length));

      for (let i = 0; i < owner.orders.length; i++) {
        const userOrder = await getOrderById(owner.orders[i]);
        userOrders.push(userOrder);
      }
      
      res.status(200).json(userOrders);
    }
  }catch(error){
    res.status(500).send(error);
  }});

  //Add New Order
  router.post('/:ownerId', async (req,res)=>{
    const ownerId = req.params.ownerId;
    const order = req.body;
    if(!order || !order.item || !order.quantity){
      res.status(400).json({message:'Invalid request'});
    }
    else{
      try{
        debugOrder(JSON.stringify(order));
        order._id = new ObjectId();
        const addOrderResult =  await addOrder(order);
        debugOrder(JSON.stringify(addOrderResult));
        const currentOwner = await GetPetOwnerById(ownerId);
        currentOwner.orders.push(order._id);
        const updateUserResult = await updatePetOwner(currentOwner);
        debugOrder(JSON.stringify(updateUserResult));
        res.status(201).json({message:'New Order Added'});
      }catch(error){
        res.status(500).send(error);
      }
    }
  });


export {router as orderRouter};