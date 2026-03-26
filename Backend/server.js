const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'CLIENT_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Raw body middleware for Stripe webhooks (must be before express.json)
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

// Regular JSON middleware for all other routes
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
app.use('/api/draws', require('./routes/drawRoutes'));
app.use('/api/charities', require('./routes/charityRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => res.json({ message: 'Golf Charity API Running' }));

const PORT = process.env.PORT || 5000;

const startServer=async()=>{
    try{
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
      });
    }
    catch(err){
        console.log(err.message)
        process.exit(1)
    }
}
startServer()