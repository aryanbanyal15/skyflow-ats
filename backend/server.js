require('dotenv').config();
const express=require('express');
const cors=require('cors');
const connectDB=require('./config/db');
const User=require('./models/User');

const seedUsers = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });

    if (!adminExists) {
      await User.create({
        username:'admin',
        password:'Aviation@2026',
        role:'admin'
      });
      console.log('Admin user seeded');
    }

    const schedulerExists = await User.findOne({ username: 'scheduler' });

    if (!schedulerExists) {
      await User.create({
        username:'scheduler',
        password:'Slots@2026',
        role:'scheduler'
      });
      console.log('Scheduler user seeded');
    }

  } catch(err){
    console.error('Error seeding users:',err.message);
  }
};

connectDB()
  .then(async () => {
    console.log("Mongo Connected");
    await seedUsers();
  })
  .catch(err => console.error("DB Error:", err));

const app=express();

app.use(cors());
app.use(express.json());

app.use('/api',require('./routes/slotRoutes'));
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/analytics',require('./routes/analyticsRoutes'));

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
 console.log(`Server running ${PORT}`);
});