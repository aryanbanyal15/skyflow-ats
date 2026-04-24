import React,{useState} from 'react';

const airlines=['Indigo','Air India','SpiceJet','Vistara','Akasa Air'];
const cities=['Delhi','Mumbai','Bangalore','Chennai','Kolkata','Hyderabad','Pune'];
const priorities=['High', 'Medium', 'Low'];
const aircrafts=['A320', 'A321', 'B737', 'B777', 'A350'];

export default function SlotForm({addSlot}){

const[form,setForm]=useState({
airline:'Indigo',
fromCity:'Delhi',
toCity:'Mumbai',
slotTime:'',
autoMode:true,
blockTime:'',
priority: 'Medium',
aircraftType: 'A320'
});

const submit=async(e)=>{
e.preventDefault();
try{
await addSlot(form);
alert('Slot successfully processed by Optimization Engine');
}catch(e){
alert(e.response?.data?.message||'Error adding slot');
}
}

return(
<div className="card form-card">
  <h2>Optimize & Allocate Slot</h2>
  <form onSubmit={submit} className="slot-form">

    <div className="form-row">
      <div className="form-group">
        <label>Airline</label>
        <select value={form.airline} onChange={e=>setForm({...form, airline:e.target.value})}>
          {airlines.map(a=><option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Priority</label>
        <select value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
          {priorities.map(p=><option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Origin</label>
        <select value={form.fromCity} onChange={e=>setForm({...form, fromCity:e.target.value})}>
          {cities.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Destination</label>
        <select value={form.toCity} onChange={e=>setForm({...form, toCity:e.target.value})}>
          {cities.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Departure Time</label>
        <input type='datetime-local' value={form.slotTime} onChange={e=>setForm({...form, slotTime:e.target.value})} required />
      </div>
      <div className="form-group">
        <label>Aircraft</label>
        <select value={form.aircraftType} onChange={e=>setForm({...form, aircraftType:e.target.value})}>
          {aircrafts.map(a=><option key={a} value={a}>{a}</option>)}
        </select>
      </div>
    </div>

    <div className="toggle-group">
      <label className="toggle-label">
        <span className="toggle-text">Rationalized Block Time (Auto)</span>
        <input type='checkbox' checked={form.autoMode} onChange={()=>setForm({...form, autoMode:!form.autoMode})} className="toggle-checkbox" />
        <div className="toggle-switch"></div>
      </label>
    </div>

    {!form.autoMode &&(
      <div className="form-group animate-slide-down">
        <label>Manual Block Time (mins)</label>
        <input type='number' value={form.blockTime} onChange={e=>setForm({...form, blockTime:e.target.value})} required={!form.autoMode} />
      </div>
    )}

    <button type="submit" className="btn-primary">Optimize Slot</button>
  </form>
</div>
)
}
