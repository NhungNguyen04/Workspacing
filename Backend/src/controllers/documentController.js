const Document = require('../models/documentModel'); // Adjust the path as necessary

// Get a document by ID
const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Create a new document
const createDocument = async (req, res) => {
    const { id} = req.body;
    const document = new Document({ _id:id, data:""});

    try {
        const newDocument = await document.save();
        res.status(201).json(newDocument);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing document
const updateDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        document.data = req.body.data || document.data;
        const updatedDocument = await document.save();
        res.json(updatedDocument);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getDocumentById,
    createDocument,
    updateDocument
};