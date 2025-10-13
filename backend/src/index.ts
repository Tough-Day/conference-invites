import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import passport from './config/passport.js';
import authRouter from './routes/auth.js';
import { conferenceRouter } from './routes/conferences.js';
import { submissionRouter } from './routes/submissions.js';
import { analyticsRouter } from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL session store
const PgSession = connectPgSimple(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Handle pool errors
pgPool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client (session pool):', err);
});

console.log('[Session] Configuring PostgreSQL session store...');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Session configuration with PostgreSQL store
app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: 'session', // Table name for sessions
      createTableIfMissing: true, // Auto-create table in development
      pruneSessionInterval: 60 * 15, // Cleanup expired sessions every 15 minutes
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === 'production', // Trust proxy in production (Cloud Run)
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-domain in production
      path: '/',
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth Routes
app.use('/auth', authRouter);

// API Routes
app.use('/api/conferences', conferenceRouter);
app.use('/api/submissions', submissionRouter);
app.use('/api/analytics', analyticsRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
