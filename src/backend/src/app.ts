import express from 'express';
import cors from 'cors';
import serviceRecordRoutes from './routes/serviceRecordRoutes';
import pointsRoutes from './routes/pointsRoutes';
import { config } from './config/config';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/service-records', serviceRecordRoutes);
app.use('/api/points', pointsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
});

// Start server
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
}); 