import { MongoClient, ObjectId } from "mongodb";
import * as dotenv from 'dotenv';
dotenv.config();
import debug from 'debug';
const debugDb = debug('app:Database');

let _db = null;

async function connectToDatabase() {
  if(!_db){
    const connectionString = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME;

    const client = await MongoClient.connect(connectionString);
    _db = client.db(dbName);
  }
  return _db;
}

async function ping(){
  const db = await connectToDatabase();
  const pong = await db.command({ ping: 1 });
  debugDb(`Ping:, ${JSON.stringify(pong)}`);
}

async function GetAllPetOwners(){
  const db = await connectToDatabase();
  return await db.collection('PetOwners').find({}).toArray();
}

async function GetPetOwnerById(id){
  const db = await connectToDatabase();
    const user = await db.collection('PetOwners').findOne({_id: id});
    //debugDb(`User: ${JSON.stringify(user)}`);
    return user;
  
}

async function addPetOwner(owner){
  const db =await connectToDatabase();
  const dbResult = await db.collection('PetOwners').insertOne(owner);
  return dbResult;
}

async function updatePetOwner(updatedOwner){
  const db = await connectToDatabase();
  debugDb(`Updated Owner: ${JSON.stringify(updatedOwner)}`);
  const dbResult = await db.collection('PetOwners').updateOne({_id: new ObjectId(updatedOwner._id)}, {$set: updatedOwner});
  return dbResult;
}

async function deletePetOwner(id){
  const db = await connectToDatabase();
  const dbResult = await db.collection('PetOwners').deleteOne({_id: new ObjectId(id)});
  return dbResult;
} 


async function getOrderById(id){
  const db = await connectToDatabase();
   // debugDb(`ID: ${id}`);
    const order = await db.collection('Orders').findOne({_id: new ObjectId(id)});
   // debugDb(`Order: ${JSON.stringify(order)}`);
    return order;
}

async function addOrder(order){
  const db = await connectToDatabase();
    const dbResult = await db.collection('Orders').insertOne(order);
    return dbResult;
}

ping();

export{GetAllPetOwners, GetPetOwnerById, addPetOwner, updatePetOwner, deletePetOwner, addOrder, getOrderById};