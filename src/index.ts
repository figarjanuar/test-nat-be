import express, { Application } from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';

import reviewRoutes from './routes/reviewRoutes';

const app: Application = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/reviews', reviewRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});