import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pino from 'pino-http';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(
    pino({
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname',
                messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
                hideObject: true,
            },
        },
    }),
);

app.get('/notes', (req, res) => {
    res.status(200).json({ message: "Retrieved all notes" });
});


app.get('/notes/:noteId', (req, res) => {
    res.status(200).json({
        message: `Retrieved note with ID: ${req.params.noteId}`,
    });
});
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});