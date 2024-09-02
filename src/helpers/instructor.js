import Instructor from '../models/instructor.js';

const instructorHelper = {
    existsInstructorID: async (id) => {
        try {
            const exists = await Instructor.findById(id);
            if (!exists) {
                throw new Error(`The instructor with ID ${id} does not exist`);
            }
            return exists;
        } catch (error) {
            throw new Error(`Error searching for instructor by ID: ${error.message}`);
        }
    },

    doesInstructorExist: async (id) => {
        try {
            const count = await Instructor.countDocuments({ _id: id });
            return count > 0; // Devuelve true si existe, false si no
        } catch (error) {
            throw new Error(`Error checking instructor existence: ${error.message}`);
        }
    }
};

export { instructorHelper };