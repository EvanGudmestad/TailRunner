import express from 'express';

const router = express.Router();

const dogOwners = [
  {id:1,firstName:'John', lastName:'Doe', dogs:['Rex', 'Spot']},
  {id:2,firstName:'Jane', lastName:'Smith', dogs:['Rover']}
]

router.get('/list', (req, res) => {
  res.status(200).send(dogOwners);
});

router.get('/:id', (req, res) => {
  const dogOwner = dogOwners.find(dogOwner => dogOwner.id === parseInt(req.params.id));
  if (!dogOwner) res.status(404).send('The dog owner with the given ID was not found');
  res.status(200).send(dogOwner);
});

router.post('/add', (req,res)=>{
  const dogOwner = req.body;
  if(!dogOwner.firstName || !dogOwner.lastName || !dogOwner.dogs){
    res.status('400').send('Please provide a first name, last name, and at least one dog');
  }else{
    dogOwner.id = dogOwners.length + 1;
    dogOwners.push(dogOwner);
    res.status(200).send(`Dog owner successfully added`);
  }
});

router.put('/update/:id', (req,res)=>{
 const dogOwner = dogOwners.find(dogOwner => dogOwner.id === parseInt(req.params.id));
  if(!dogOwner){
      res.status(404).send('The dog owner with the given ID was not found');
    }
  else{
    //const updatedDogOwner = {...dogOwner, ...req.body}; // Merge the two objects
    const updatedDogOwner = {...dogOwner};
  
    if(req.body.firstName) updatedDogOwner.firstName = req.body.firstName;
    if(req.body.lastName) updatedDogOwner.lastName = req.body.lastName;
    if(req.body.dogs && dogOwner.dogs){
      req.body.dogs.forEach(dog => {
        updatedDogOwner.dogs.push(dog);  
      });
      
    }
    dogOwners[dogOwners.indexOf(dogOwner)] = updatedDogOwner;
    res.status(200).send(`Dog owner successfully updated`);
  }
});

router.delete('/delete/:id', (req,res)=>{
  const dogOwner = dogOwners.find(dogOwner => dogOwner.id === parseInt(req.params.id));
  if(!dogOwner){
    res.status(404).send('The dog owner with the given ID was not found');
  }else{
    dogOwners.splice(dogOwners.indexOf(dogOwner),1);
    res.status(200).send(`Dog owner successfully deleted`);
  }
});


export {router as dogOwnerRouter};