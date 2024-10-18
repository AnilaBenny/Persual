import express from 'express';
import dotenv from 'dotenv';
import logger from './middleware/logger';
import authRoute from './routes/authRoute';
import articleRoutes from './routes/articleRoutes';

dotenv.config();

const app = express();


app.use(express.json());


app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});


app.use('/', authRoute, articleRoutes);


app.use((err: any, req: any, res: any, next: any) => {
  logger.error(`${err.status || 500} - ${err.message}`);
  res.status(err.status || 500).send('Something went wrong!');
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
