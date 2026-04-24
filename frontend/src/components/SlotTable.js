import React from 'react';

export default function SlotTable({
slots,
onDelete
}){

if (slots.length === 0) {
  return (
    <div className="empty-state">
      <p>No flight slots found. Create a new slot to get started.</p>
    </div>
  );
}

return(
<div className="table-container card">
  <table className="modern-table">
    <thead>
      <tr>
        <th>Airline</th>
        <th>Route</th>
        <th>Departure Time</th>
        <th>Block Time</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {slots.map(slot=>(
      <tr key={slot._id}>
        <td>
          <span className="airline-badge">{slot.airline}</span>
        </td>
        <td className="route-cell">
          <strong>{slot.fromCity}</strong>
          <span className="route-arrow">→</span>
          <strong>{slot.toCity}</strong>
        </td>
        <td>
          <div className="time-cell">
            <span className="date">{new Date(slot.slotTime).toLocaleDateString()}</span>
            <span className="time">{new Date(slot.slotTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </td>
        <td>
          <span className="block-time">{slot.blockTime.toFixed(1)} mins</span>
        </td>
        <td>
          <button
            className="btn-danger btn-icon"
            onClick={()=>onDelete(slot._id)}
            title="Delete Slot"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
)
}
