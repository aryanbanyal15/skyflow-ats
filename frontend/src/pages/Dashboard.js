import React,{useEffect,useState,useContext} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import API from '../services/api';
import SlotForm from '../components/SlotForm';
import SlotTable from '../components/SlotTable';
import Filters from '../components/Filters';
import StatsCards from '../components/StatsCards';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Dashboard(){

const[slots,setSlots]=useState([]);
const[filter,setFilter]=useState('');
const { logout } = useContext(AuthContext);

const fetchSlots=async()=>{
try {
  const res=await API.get('/slots');
  setSlots(res.data);
} catch (e) {
  console.error(e);
}
};

useEffect(()=>{
fetchSlots();
},[]);

const addSlot=async(data)=>{
await API.post('/slots',data);
fetchSlots();
};

const deleteSlot=async(id)=>{
await API.delete(`/slots/${id}`);
fetchSlots();
};

const updateSlot=async(id,data)=>{
await API.put(`/slots/${id}`,data);
fetchSlots();
};

const exportPDF = () => {
  const doc = new jsPDF();
  doc.text("Aviation Slot Allocation Report", 20, 10);
  doc.autoTable({
    head: [['Airline', 'Route', 'Departure Time', 'Status']],
    body: slots.map(s => [s.airline, `${s.fromCity} to ${s.toCity}`, new Date(s.slotTime).toLocaleString(), s.status]),
  });
  doc.save('slot_report.pdf');
};

const exportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(slots.map(s => ({
    Airline: s.airline,
    Origin: s.fromCity,
    Destination: s.toCity,
    Departure: new Date(s.slotTime).toLocaleString(),
    BlockTime: s.blockTime,
    Priority: s.priority,
    Status: s.status
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Slots");
  XLSX.writeFile(wb, "slot_report.xlsx");
};

const filtered=filter
?slots.filter(s=>
 s.airline.toLowerCase().includes(filter.toLowerCase())||
 s.fromCity.toLowerCase().includes(filter.toLowerCase())||
 s.toCity.toLowerCase().includes(filter.toLowerCase())
)
:slots;

return(
<div className="dashboard-layout">
  <nav className="sidebar glass-panel">
    <h2>Aviation<br/>Scheduler</h2>
    <div className="nav-links">
      <Link to="/" className="nav-link active">Dashboard</Link>
      <Link to="/analytics" className="nav-link">Analytics</Link>
      <Link to="/map" className="nav-link">Route Map</Link>
      <button onClick={logout} className="nav-link btn-logout">Logout</button>
    </div>
  </nav>

  <div className="dashboard-container">
    <header className="dashboard-header">
      <h1>Intelligent Slot Allocation System</h1>
      <p>Dynamic block-time rationalization & optimization</p>
    </header>

    <div className="dashboard-top-section">
      <StatsCards slots={slots}/>
    </div>

    <div className="dashboard-main-section">
      <aside className="dashboard-sidebar">
        <SlotForm addSlot={addSlot}/>
      </aside>
      <section className="dashboard-content">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
          <Filters setFilter={setFilter}/>
          <div style={{display:'flex', gap:'1rem'}}>
            <button onClick={exportPDF} className="btn-secondary">Export PDF</button>
            <button onClick={exportExcel} className="btn-secondary">Export Excel</button>
          </div>
        </div>
        <SlotTable
          slots={filtered}
          onDelete={deleteSlot}
          onUpdate={updateSlot}
        />
      </section>
    </div>
  </div>
</div>
)
}
