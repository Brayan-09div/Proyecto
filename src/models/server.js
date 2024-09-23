import express from 'express';
import http from 'http';
import cors from 'cors';
import cron from 'node-cron';
import { dbconnect } from "../../databases/config.js";
import { createBackup } from '../utils/backupHelper.js'; 

import aprrenticeRoutes from '../routes/apprentice.js';
import assignmentRoutes from '../routes/assignment.js';
import binnaclesRoutes from '../routes/binnacles.js';
import followupRoutes from '../routes/followup.js';
import logsRoutes from '../routes/logs.js';
import modalityRoutes from '../routes/modality.js';
import registerRoutes from '../routes/register.js';
import userEPRoutes from '../routes/userEP.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = http.createServer(this.app);
    
        this.middlewares();
        this.routes();
        this.conectarbd();
        this.scheduleBackups(); // Programar las copias de seguridad
    }

    async conectarbd() {
        await dbconnect();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use('/api/userEP', userEPRoutes);
        this.app.use('/api/apprendice', aprrenticeRoutes);
        this.app.use('/api/assignments', assignmentRoutes);
        this.app.use('/api/binnacles', binnaclesRoutes);
        this.app.use('/api/followup', followupRoutes);
        this.app.use('/api/logs', logsRoutes);
        this.app.use('/api/modality', modalityRoutes);
        this.app.use('/api/register', registerRoutes);

        // Ruta para ejecutar manualmente el backup
        this.app.post('/api/backup', async (req, res) => {
            try {
                await createBackup();
                res.status(200).send('Backup creado con éxito');
            } catch (error) {
                res.status(500).send('Error al crear el backup');
            }
        });
    }

    scheduleBackups() {
        // Programar el backup diario a las 3 a.m.
        cron.schedule('0 3 * * *', async () => {
            try {
                await createBackup();
                console.log('Backup automático realizado con éxito');
            } catch (error) {
                console.error('Error al realizar el backup automático:', error);
            }
        });
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    }
}

export { Server };
