import Assignment from '../models/assignment.js';

const assignmentHelper = {
    existsAssignmentID: async (id) => {
        try {
            const exists = await Assignment.findById(id);
            if (!exists) {
                throw new Error(`The assignment with ID ${id} does not exist`);
            }
            return exists;
        } catch (error) {
            throw new Error(`Error searching for assignment by ID: ${error.message}`);
        }
    }
}

export { assignmentHelper };












;