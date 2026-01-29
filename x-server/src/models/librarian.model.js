const mongoose = require('mongoose');

const librarianSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        employeeId: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
        },
        department: {
            type: String,
            default: 'General',
        },
        role: {
            type: String,
            enum: ['Senior', 'Junior', 'Intern'],
            default: 'Junior',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Librarian', librarianSchema);