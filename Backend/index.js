// // const express = require('express');
// // const cors = require('cors');
// // const connectDB = require('./config/db');
// // const session = require('express-session');

// // const authRoutes = require('./routes/authRoutes');
// // const clubRoutes=require('./routes/clubRoutes')
// // const eventRoutes=require('./routes/eventRoutes')

// // const app = express();

// // connectDB();
// // const cookieParser = require('cookie-parser');
// // app.use(cookieParser());

// // app.use(cors({
// //   origin: 'http://localhost:5173/',
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// // app.use(session({
// //   secret: 'mnkjhiuyuyuytyrf',
// //   resave: false,
// //   saveUninitialized: false,
// //   cookie: {
// //     httpOnly: true,
// //     secure: process.env.NODE_ENV === 'production',
// //     sameSite: 'strict',
// //     maxAge: 24 * 60 * 60 * 1000 
// //   }
// // }));

// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // app.use('/uploads', express.static('uploads'));
// // app.use(require('cookie-parser')());

// // app.use('/api/auth', authRoutes);
// // app.use('/api/club',clubRoutes)
// // app.use('/api/event',eventRoutes)

// // app.use((err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(500).json({ 
// //     message: 'Something went wrong!', 
// //     error: process.env.NODE_ENV === 'development' ? err.message : {} 
// //   });
// // });

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });


// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');

// const authRoutes = require('./routes/authRoutes'); // Auth (including Google)
// const clubRoutes = require('./routes/clubRoutes');
// const eventRoutes = require('./routes/eventRoutes');
// const announcement=require('./routes/announcementRoutes')
// const competition=require('./routes/competitionRoutes')

// const competitionRoutes = require('./routes/activityRoute.js');
// app.use('/api/competitions', competitionRoutes);

// const app = express();

// connectDB();

// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));




// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/uploads', express.static('uploads'));

// // Routes
// app.use('/api/auth', authRoutes);  // Now includes Google OAuth
// app.use('/api/club', clubRoutes);
// app.use('/api/event', eventRoutes);
// app.use('/api/competitions', competitionRoutes);
// app.use('/api/announcement',announcement);
// app.use('/api/competition',competition)

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     message: 'Something went wrong!', 
//     error: process.env.NODE_ENV === 'development' ? err.message : {} 
//   });
// });

// // Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const authRoutes = require('./routes/authRoutes');
const clubRoutes=require('./routes/clubRoutes')
const eventRoutes=require('./routes/eventRoutes')
const announcement=require('./routes/announcementRoutes')
const competition=require('./routes/competitionRoutes')

const app = express();

connectDB();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use(require('cookie-parser')());

app.use('/api/auth', authRoutes);
app.use('/api/club',clubRoutes)
app.use('/api/event',eventRoutes)
app.use('/api/announcement',announcement);
app.use('/api/competition',competition)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});