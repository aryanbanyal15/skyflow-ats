const Slot=require('../models/Slot');
const distances=require('../utils/cityDistances');
const hasConflict=require('../utils/conflictDetection');
const optimizationEngine=require('../services/optimizationEngine');

const AVG_SPEED=800;
const BUFFER=20;

exports.createSlot=async(req,res)=>{
try{
const{
airline,
fromCity,
toCity,
slotTime,
autoMode,
blockTime,
aircraftType,
priority
}=req.body;

if(!airline||!fromCity||!toCity||!slotTime){
return res.status(400).json({
message:'Missing required fields'
});
}

let finalBlockTime;

if(autoMode){
const key=`${fromCity}-${toCity}`;
const reverse=`${toCity}-${fromCity}`;

const distance=
distances[key]||distances[reverse];

if(!distance){
return res.status(400).json({
message:'Route distance unavailable'
});
}

finalBlockTime=((distance/AVG_SPEED)*60)+BUFFER;
}else{
finalBlockTime=Number(blockTime);
}

const existing=await Slot.find({});

const optimizationResult = optimizationEngine.optimizeSlotAllocation(
  { priority, slotTime }, 
  existing, 
  finalBlockTime
);

const slot=await Slot.create({
airline,
fromCity,
toCity,
slotTime: optimizationResult.allocatedTime,
blockTime:finalBlockTime,
aircraftType,
priority,
status: optimizationResult.status
});

res.status(201).json({
  slot,
  message: optimizationResult.delayMinutes > 0 
    ? `Slot optimized to avoid conflict. Delayed by ${optimizationResult.delayMinutes} mins.` 
    : 'Slot successfully allocated.'
});

res.status(201).json(slot);

}catch(err){
res.status(500).json({message:err.message});
}
};

exports.getSlots=async(req,res)=>{
try{
const slots=await Slot.find().sort({slotTime:1});
res.json(slots);
}catch(err){
res.status(500).json({message:err.message});
}
};

exports.updateSlot=async(req,res)=>{
try{
const updated=await Slot.findByIdAndUpdate(
req.params.id,
req.body,
{new:true,runValidators:true}
);
res.json(updated);
}catch(err){
res.status(500).json({message:err.message});
}
};

exports.deleteSlot=async(req,res)=>{
try{
await Slot.findByIdAndDelete(req.params.id);
res.json({message:'Deleted'});
}catch(err){
res.status(500).json({message:err.message});
}
};
