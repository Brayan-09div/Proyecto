import logs from "../models/logs.js";

const logController = {
 
  // Listar todos los logs---------------------------------------------
  listLogs: async (req, res) => {
    try {
      const log = await logs.find();
      console.log("Log list:", log);
      res.json(log);
    } catch (error) {
      console.error("Error listing logs:", error);
      res.status(500).json({ error: "Error listing logs" });
    }
  },

  // Listar un log por su ID-------------------------------------------
  getLogById: async (req, res) => {
    const { id } = req.params;
    try {
      const log = await logs.findById(id);
      if (!log) return res.status(404).json({ error: "Log not found" });

      console.log("Log found:", log);
      res.json(log);
    } catch (error) {
      console.error("Error listing log by ID:", error);
      res.status(500).json({ error: "Error listing log by ID" });
    }
  },
 // Crear nuevo log-------------------------------------------------
 createLog: async (req, res) => {
  const { users, information, data, hourinstructorproyect, createdAt, updatedAt, status} = req.body;
  try {
    const newLog = new logs({ users, information, data, hourinstructorproyect, createdAt, updatedAt, status});
    const result = await newLog.save();
    console.log("Log created:", result);
    res.json(result);
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ error: "Error creating log" });
  }
},

  // Activar o desactivar un log por su ID--------------------------------------
  toggleLogState: async (req, res) => {
    const { id } = req.params;
    try {
      const log = await logs.findById(id);
      if (!log) return res.status(404).json({ error: "Log not found" });

      log.status= log.status=== 1 ? 0 : 1; 
      await log.save();

      const message = log.status=== 1 ? "Log activated successfully" : "Log deactivated successfully";
      res.json({ msg: message });
    } catch (error) {
      console.error("Error toggling log state:", error);
      res.status(500).json({ error: "Error toggling log state" });
    }
  },
};

export default logController;