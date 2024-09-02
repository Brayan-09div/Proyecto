import Usuario from "../models/userEP.js";

const userHelper = {
    userExistsByID: async (id) => {
        try {
            const exists = await Usuario.findById(id);
            if (!exists) {
                throw new Error(`User with ID ${id} does not exist`);
            }
            return exists;
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
    },

    emailExists: async (email, method = "POST") => {
        try {
            const exists = await Usuario.findOne({ email });
            if (exists) {
                throw new Error(`Email already exists in the database: ${email}`);
            }
        } catch (error) {
            throw new Error(`Error checking email: ${error.message}`);
        }
    },

    verifyEmail: async (email) => {
        try {
            const exists = await Usuario.findOne({ email });
            if (!exists) {
                throw new Error(`Email ${email} is not registered`);
            }
            return exists;
        } catch (error) {
            throw new Error(`Error verifying email: ${error.message}`);
        }
    },
};

export { userHelper };