const express=require('express');
const router=express.Router();
const {
createSlot,
getSlots,
updateSlot,
deleteSlot
}=require('../controllers/slotController');

router.post('/slots',createSlot);
router.get('/slots',getSlots);
router.put('/slots/:id',updateSlot);
router.delete('/slots/:id',deleteSlot);

module.exports=router;
