const mongoose=require('mongoose');

const slotSchema=new mongoose.Schema({
airline:{
type:String,
required:true
},
fromCity:{
type:String,
required:true
},
toCity:{
type:String,
required:true
},
slotTime:{
type:Date,
required:true
},
blockTime:{
type:Number,
required:true
},
aircraftType:{
type:String,
default:'A320'
},
priority:{
type:String,
enum:['High', 'Medium', 'Low'],
default:'Medium'
},
status:{
type:String,
enum:['Scheduled', 'Delayed', 'Optimized'],
default:'Scheduled'
}
},{timestamps:true});

module.exports=mongoose.model('Slot',slotSchema);
