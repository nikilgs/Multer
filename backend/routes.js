const express = require('express');
const router = express.Router();
const upload = require('./storage'); 
const {postingImage ,singleImage } = require('./cotroller'); 


router.post('/upload', upload.single('image'), postingImage); 
router.route('/:id').get(singleImage)

module.exports = router;