import mongoose from 'mongoose';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_CNX = process.env.MONGODB_CNX;
const BACKUP_DB = 'backups'; // Nombre de la base de datos para respaldos
const BACKUP_COUNT = 7; // Número máximo de respaldos a mantener

let originalConnection;

async function createBackup() {
  try {
    if (!originalConnection) {
      // Conectarse a la base de datos original
      originalConnection = await mongoose.connect(MONGODB_CNX);
      console.log('Conectado a la base de datos original');
    }

    // Conectar a la base de datos de respaldos
    const backupConnection = mongoose.createConnection(`${MONGODB_CNX}/${BACKUP_DB}`);
    await backupConnection.once('open', () => {
      console.log('Conectado a la base de datos de respaldos');
    });

    const collections = await originalConnection.connection.db.listCollections().toArray();
    const backupNumber = await getNextBackupNumber(backupConnection);
    const backupCollectionPrefix = `copyProject${backupNumber}`;

    for (const sourceCol of collections) {
      const sourceModelName = sourceCol.name;
      const BackupModelName = `${backupCollectionPrefix}_${sourceModelName}`;

      const SourceModel = originalConnection.model(sourceModelName, new mongoose.Schema({}, { strict: false }));
      const BackupModel = backupConnection.model(BackupModelName, new mongoose.Schema({}, { strict: false }));

      // Copiar documentos
      const sourceData = await SourceModel.find({}).lean();
      if (sourceData.length > 0) {
        await BackupModel.insertMany(sourceData);
        console.log(`Backup de ${sourceCol.name} completado: ${BackupModelName}`);
      }
    }

    await deleteOldBackups(backupConnection); // Eliminar respaldos antiguos
    await backupConnection.close(); // Cerrar conexión de respaldo
  } catch (error) {
    console.error('Error al crear el backup:', error);
  }
}

// Función para obtener el siguiente número de respaldo
async function getNextBackupNumber(backupConnection) {
  const existingBackups = await backupConnection.db.listCollections().toArray();
  const backups = existingBackups.filter(col => col.name.startsWith('copyProject'));
  return (backups.length % BACKUP_COUNT) + 1; // Mantener un número cíclico
}

// Función para eliminar respaldos antiguos
async function deleteOldBackups(backupConnection) {
  const backups = await backupConnection.db.listCollections().toArray();
  const backupCollections = backups.filter(col => col.name.startsWith('copyProject'));

  // Si hay más de 7 respaldos, eliminar los más antiguos
  if (backupCollections.length > BACKUP_COUNT) {
    const sortedBackups = backupCollections.sort((a, b) => a.name.localeCompare(b.name));
    const collectionsToDelete = sortedBackups.slice(0, backupCollections.length - BACKUP_COUNT);
    
    for (const col of collectionsToDelete) {
      await backupConnection.db.dropCollection(col.name);
      console.log(`Respaldo antiguo eliminado: ${col.name}`);
    }
  }
}

// Programar el backup cada minuto
cron.schedule('* * * * *', createBackup);

// Exportar la función para uso manual
export { createBackup };



