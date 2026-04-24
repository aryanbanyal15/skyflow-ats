import React from 'react';

export default function StatsCards({slots}){

const routes={};
slots.forEach(s=>{
const r=`${s.fromCity} ➔ ${s.toCity}`;
routes[r]=(routes[r]||0)+1;
});

let busiest='N/A';
let max=0;

for(let r in routes){
if(routes[r]>max){
max=routes[r];
busiest=r;
}
}

return(
<div className="stats-container">
  <div className="stat-card glass-panel">
    <div className="stat-icon pulse-icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    </div>
    <div className="stat-content">
      <p className="stat-title">Total Slots Allocated</p>
      <h3 className="stat-value">{slots.length}</h3>
    </div>
  </div>
  
  <div className="stat-card glass-panel">
    <div className="stat-icon route-icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    </div>
    <div className="stat-content">
      <p className="stat-title">Busiest Route</p>
      <h3 className="stat-value text-ellipsis" title={busiest}>{busiest}</h3>
    </div>
  </div>
</div>
)
}
