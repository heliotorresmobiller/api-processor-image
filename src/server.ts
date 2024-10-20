
import express from 'express';
import dotenv from 'dotenv';
import { handleImageProcessor } from './controllers/ImageController';

dotenv.config();

const app = express();

app.get('/pictures/:key', handleImageProcessor);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
