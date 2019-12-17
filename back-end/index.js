const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

const form_descriptors_path = path.join(__dirname, 'form-descriptors');

console.log('Starting back-end application...');
app.use('/', (req, res, next) => {
    logger.logger.info({
        message: 'Request: ',
        url: req.url,
        method: req.method,
        ip: req.ip,
        query: req.query,
    });

    next();
});

app.use('/static', express.static(form_descriptors_path));

app.get('/api/forms', (req, res) => {
    const list_of_form_descriptors = fs.readdirSync(form_descriptors_path);
    const result = list_of_form_descriptors.map((item, index) => {
        try {
            let data = fs.readFileSync(path.join(form_descriptors_path, item));
            let form_descriptor = JSON.parse(data);
            return {
                'id': form_descriptor.id,
                'title': form_descriptor.title,
                'url': req.path + '/' + form_descriptor.id
            }
        } catch (err) {
            logger.logger.error('Error reading file from disk: ', err);
        }
    });
    res.send(result);
});

app.get('/api/forms/:formId(\\d+)', (req, res) => {
    const formId = req.params.formId;
    const list_of_form_descriptors = fs.readdirSync(form_descriptors_path);
    let result = null;
    list_of_form_descriptors.forEach((item, index) => {
        try {
            let data = fs.readFileSync(path.join(form_descriptors_path, item));    
            let form_descriptor = JSON.parse(data);
            if (form_descriptor.id === formId) {
                result = form_descriptor;
            }
        } catch (err) {
            logger.logger.error('Error reading file from disk: ', err);
        }
    });

    if (result == null) {
        res.status(404)
            .json({
                'err': 'Couldn\'t find the file you requested!'
            });
    } else {
        res.json(result);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
