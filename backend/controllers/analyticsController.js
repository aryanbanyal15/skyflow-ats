const Slot = require('../models/Slot');

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const slots = await Slot.find();
    
    let totalDelayMinutes = 0;
    let optimizedCount = 0;

    const hourlyDemand = Array(24).fill(0);
    const airportCongestion = {};

    slots.forEach(slot => {
      // Calculate optimized stats
      if (slot.status === 'Optimized') {
        optimizedCount++;
        // We'd ideally store exact delay, but for MVP we estimate 15m per optimization
        totalDelayMinutes += 15; 
      }

      // Hourly demand
      const hour = new Date(slot.slotTime).getHours();
      hourlyDemand[hour]++;

      // Congestion Heatmap Data
      airportCongestion[slot.fromCity] = (airportCongestion[slot.fromCity] || 0) + 1;
      airportCongestion[slot.toCity] = (airportCongestion[slot.toCity] || 0) + 1;
    });

    const totalSlots = slots.length;
    const utilizationRate = totalSlots > 0 ? ((totalSlots / 100) * 100).toFixed(1) : 0; // Assuming 100 max capacity for now

    res.json({
      totalSlots,
      optimizedSlots: optimizedCount,
      totalDelayMinutes,
      utilizationRate,
      hourlyDemand,
      airportCongestion
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
