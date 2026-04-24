const BUFFER_MINUTES=15;

function hasConflict(existingSlots,newSlotTime,newBlockTime){

const newStart=new Date(newSlotTime);
const newEnd=new Date(
newStart.getTime()+
(newBlockTime+BUFFER_MINUTES)*60000
);

for(let slot of existingSlots){

const existingStart=new Date(slot.slotTime);
const existingEnd=new Date(
existingStart.getTime()+
(slot.blockTime+BUFFER_MINUTES)*60000
);

if(
newStart < existingEnd &&
newEnd > existingStart
){
return true;
}
}

return false;
}

module.exports=hasConflict;
