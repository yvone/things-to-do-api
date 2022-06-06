var express = require('express');
var router = express.Router();

const admin = require ('firebase-admin')
const db = require('../firebase')

//Get all tours that exists
router.get('/principal', async function(req, res, next) {


  const toursRef = db.collection("TOUR");
  const snapshot = await toursRef.where('deletedAt', '==', null).get();
  if (snapshot.empty) {
    res.status(404).json({
      name: "Not found",
      message: "There are not existing tours"
    })
  }
  else{
    const list = snapshot.docs
    let array = [];
    list.map((element) =>{
      let size = 0;
    document = element.data()
    document.basicInformation !== undefined ?  size += Object.keys(document.basicInformation).length : size;
    document.intinerary !== undefined ?  size += Object.keys(document.intinerary).length : size;

    document.childrenPolicy !== undefined ? size += 1 : size;
    document.cancellationPolicy !== undefined ? size += 1 : size;

    if(document.accessibility !== undefined){
      if(document.accessibility.assistance !== undefined){
        document.accessibility.assistance.map((value)=>{
          if(value.answer != ""){
            size += 1;
          }
        })
      }
  
      if(document.accessibility.transportation !== undefined){
        document.accessibility.transportation.map((value)=>{
          if(value.answer != ""){
            size += 1;
          }
        })
      }
  
      if(document.accessibility.places !== undefined){
        document.accessibility.places.map((value)=>{
          if(value.answer != ""){
            size += 1;
          }
        })
      }
  
      if(document.accessibility.restrooms !== undefined){
        document.accessibility.restrooms.map((value)=>{
          if(value.answer != ""){
            size += 1;
          }
        })
      }
  
      if(document.accessibility.equipment !== undefined){
        document.accessibility.equipment.map((value)=>{
          if(value.answer != ""){
            size += 1;
          }
        })
      }
    }
    
    console.log("Final size", size)

    const percentage = (size / 42) *100;
        array.push({id: element.id, percentage: percentage, ...element.data()})
    })
    res.status(200).json(array)
  }
});

//Get one tour 
router.get('/one-tour/:idTour', async (req, res, next) =>{
  const {idTour} = req.params;
  const tourRef = db.collection('TOUR').doc(idTour)
  const doc = await tourRef.get();
  if(!doc.exists){
    res.status(404).json({
      name: "Not found",
      message: "Sorry, the tour doesn't exists"
    })
  }
  else{
    let size = 0;
    document = doc.data()
    document.basicInformation !== undefined ?  size += Object.keys(document.basicInformation).length : size;
    document.intinerary !== undefined ?  size += Object.keys(document.intinerary).length : size;

    document.childrenPolicy !== undefined ? size += 1 : size;
    document.cancellationPolicy !== undefined ? size += 1 : size;

    if(document.accessibility !== undefined){
      if(document.accessibility.assistance !== undefined){
        document.accessibility.assistance.map((value)=>{
          if(value.answer != ""){
            size += 1;
          }
        })
      }
  
      if(document.accessibility.transportation !== undefined){
        document.accessibility.transportation.map((value)=>{
          if(value.answer != ""){
            size += 1;
          }
        })
      }
  
      if(document.accessibility.places !== undefined){
        document.accessibility.places.map((value)=>{
          if(value.answer != ""){
            size += 1;
          }
        })
      }
  
      if(document.accessibility.restrooms !== undefined){
        document.accessibility.restrooms.map((value)=>{
          if(value.answer != ""){
            size += 1;
          }
        })
      }
  
      if(document.accessibility.equipment !== undefined){
        document.accessibility.equipment.map((value)=>{
          if(value.answer != ""){
            size += 1;
          }
        })
      }
    }
    
    console.log("Final size", size)

    const percentage = (size / 42) *100;
    console.log(percentage)
    //console.log('Document data:', doc.data());
    res.status(200).json({percentage: percentage, ...doc.data()});
  }
})

//Get admin info
router.get('/info/:idAdmin', async function(req, res, next){
  const {idAdmin} = req.params;
  const adminRef = db.collection("ADMIN").doc(idAdmin)
  const doc =await adminRef.get();
  if(!doc.exists){
    res.status(404).json({
      name: "Not found",
      message: "Sorry, the admin doesn't exists"
    })
  }
  else{
    res.status(200).json(doc.data())
  }
});

/* UPDATE ADMIN ------------------------------------------------ */
router.put('/update-admin/:idAdmin', async (req, res, next) => {
  const { idAdmin } = req.params;
  const { body } = req;
  
  try {
    // Confirmamos que existe
    const adminRef = db.collection('ADMIN').doc(idAdmin);
    const doc = await adminRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        name: "Not found",
        message: "Sorry, el admin que buscas no existe"
      })
    } else {
      // Actualiza el documento
      const tour = await db.collection('ADMIN').doc(idAdmin).update(body);

      // Actualiza la fecha de actualización
      const updatedAt = await adminRef.update({
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        name: "Edicion exitosa",
        message: "Se realizo la edición del admin exitosamente"
      });
  }} catch(err) {
    next(err);
  }
});

module.exports = router;