const hasConflict = require('../utils/conflictDetection');

// Score logic: 
// Priority Score = 0.4 Capacity Fit + 0.3 Delay Penalty + 0.2 Turnaround Efficiency + 0.1 Airline Priority
const calculatePriorityScore = (slot, delayMinutes) => {
  let priorityVal = 0;
  if (slot.priority === 'High') priorityVal = 100;
  else if (slot.priority === 'Medium') priorityVal = 50;
  else priorityVal = 10;

  // Simplified penalty logic: more delay = lower score
  const delayPenalty = Math.max(0, 100 - delayMinutes);
  const capacityFit = 80; // Placeholder for actual capacity logic
  const turnaroundEfficiency = 90; // Placeholder

  return (0.4 * capacityFit) + (0.3 * delayPenalty) + (0.2 * turnaroundEfficiency) + (0.1 * priorityVal);
};

exports.optimizeSlotAllocation = (requestedSlot, existingSlots, originalBlockTime) => {
  let optimalSlotTime = new Date(requestedSlot.slotTime);
  let delayMinutes = 0;
  let status = 'Scheduled';

  // Find the earliest available slot time without conflict
  while (hasConflict(existingSlots, optimalSlotTime, originalBlockTime)) {
    // Shift by 15 minutes
    optimalSlotTime = new Date(optimalSlotTime.getTime() + 15 * 60000);
    delayMinutes += 15;
  }

  if (delayMinutes > 0) {
    status = 'Optimized'; // It was adjusted
  }

  const priorityScore = calculatePriorityScore(requestedSlot, delayMinutes);

  return {
    allocatedTime: optimalSlotTime,
    delayMinutes,
    priorityScore,
    status
  };
};
