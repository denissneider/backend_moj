// src/index.ts

import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { connectMongoDb } from './database/connection';

import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './utils/swaggerConfig';

import strosekRoutes from './routes/strosekRoutes';
import zaposleniRoutes from './routes/zaposleniRoutes';

import * as dotenv from 'dotenv';
dotenv.config();

// Inicializacija Express aplikacije
const app = express();

// Omogoči CORS
app.use(cors());

// Middleware za parsiranje podatkov
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger dokumentacija
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Poti za API
app.use('/stroski', strosekRoutes);
app.use('/zaposleni', zaposleniRoutes);

// Povezava z MongoDB
connectMongoDb();

// Priklop na strežnik
export const startServer = () => {
	const port = process.env.PORT || 3000;
	const httpServer = createServer(app);

	httpServer.listen(port, () => {
		console.log(`Strežnik teče na portu ${port}`);
	});

	return httpServer;
};

// Eksport aplikacije za testiranje
export default app;

// Samo za ne-testna okolja
if (process.env.NODE_ENV !== 'test') {
	startServer();
}
