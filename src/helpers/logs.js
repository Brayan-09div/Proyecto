import logs from "../models/logs.js";

const logsHelper = {
    existsLogID: async (id) => {
        try {
            const exists = await logs.findById(id);
            if (!exists) {
                throw new Error(`The log with ID ${id} does not exist`);
            }
            return exists;
        } catch (error) {
            throw new Error(`Error searching for log by ID: ${error.message}`);
        }
    },
}

export { logsHelper };