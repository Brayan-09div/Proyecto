import express from 'express';
import http from 'http';
import cors from 'cors';
import { dbconnect } from "../../databases/config.js"

import aprrenticeRoutes from '../routes/apprentice.js'
import assignmentRoutes from '../routes/assignment.js'
import binnaclesRoutes from '../routes/binnacles.js'
import followupRoutes from '../routes/followup.js'
import logsRoutes from '../routes/logs.js'
import modalityRoutes from '../routes/modality.js'
import registerRoutes from '../routes/register.js'
import userEPRoutes from '../routes/userEP.js'
import repfora from '../routes/repfora.js';

// import backupDatabase from '../../backup.js';



class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = http.createServer(this.app);
    
        this.middlewares();
        this.routes();
        this.conectarbd();
        // this.scheduleBackups(); // Programar las copias de seguridad
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
        this.app.use('/api/repfora', repfora);
        this.app.use('/api/userEP', userEPRoutes);
        this.app.use('/api/apprendice', aprrenticeRoutes);
        this.app.use('/api/assignments', assignmentRoutes);
        this.app.use('/api/binnacles', binnaclesRoutes);
        this.app.use('/api/followup', followupRoutes);
        this.app.use('/api/logs', logsRoutes);
        this.app.use('/api/modality', modalityRoutes);
        this.app.use('/api/register', registerRoutes);

        this.app.use('/api/backup', (req, res) => {
            backupDatabase()
                .then(() => res.send('Backup completado'))
                .catch(err => res.status(500).send('Error en el backup'));
        });
 
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    }
}

export { Server };
