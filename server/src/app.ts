import express from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import progressRoutes from './routes/progress.routes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('System API! Im running great man!');   
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
