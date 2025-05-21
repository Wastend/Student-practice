const coverLetterModel = require('../models/coverLetterModel');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const uploadCoverLetter = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await coverLetterModel.createCoverLetter(req.user.id, req.file);
        res.json(result);
    } catch (error) {
        console.error('Error uploading cover letter:', error);
        res.status(500).json({ message: 'Error uploading cover letter' });
    }
};

const getCoverLetter = async (req, res) => {
    try {
        const coverLetter = await coverLetterModel.getCoverLetterById(req.params.id);
        if (!coverLetter) {
            return res.status(404).json({ message: 'Cover letter not found' });
        }
        res.json(coverLetter);
    } catch (error) {
        console.error('Error getting cover letter:', error);
        res.status(500).json({ message: 'Error getting cover letter' });
    }
};

const getUserCoverLetter = async (req, res) => {
    try {
        const coverLetter = await coverLetterModel.getCoverLetterByUserId(req.user.id);
        if (!coverLetter) {
            return res.status(404).json({ message: 'Cover letter not found' });
        }
        res.json(coverLetter);
    } catch (error) {
        console.error('Error getting user cover letter:', error);
        res.status(500).json({ message: 'Error getting user cover letter' });
    }
};

const deleteCoverLetter = async (req, res) => {
    try {
        await coverLetterModel.deleteCoverLetter(req.params.id);
        res.json({ message: 'Cover letter deleted successfully' });
    } catch (error) {
        console.error('Error deleting cover letter:', error);
        res.status(500).json({ message: 'Error deleting cover letter' });
    }
};

const downloadCoverLetter = async (req, res) => {
    try {
        const file = await coverLetterModel.getCoverLetterFile(req.params.id);
        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
        res.send(file.buffer);
    } catch (error) {
        console.error('Error downloading cover letter:', error);
        res.status(500).json({ message: 'Error downloading cover letter' });
    }
};

module.exports = {
    uploadCoverLetter: [upload.single('file'), uploadCoverLetter],
    getCoverLetter,
    getUserCoverLetter,
    deleteCoverLetter,
    downloadCoverLetter
}; 