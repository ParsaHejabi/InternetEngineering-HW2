const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 9000;

const FORM_DESCRIPTORS_PATH = path.join(__dirname, 'form-descriptors');

/* eslint no-console: ["error", { allow: ["log"] }] */
console.log('Starting back-end application...');
app.use(cors());
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

app.use('/static', express.static(FORM_DESCRIPTORS_PATH));

app.get('/api/forms', (req, res) => {
  const LIST_OF_FORM_DESCRIPTORS = fs.readdirSync(FORM_DESCRIPTORS_PATH);
  const result = LIST_OF_FORM_DESCRIPTORS.map((item) => {
    try {
      const data = fs.readFileSync(path.join(FORM_DESCRIPTORS_PATH, item));
      const FORM_DESCRIPTOR = JSON.parse(data);
      return {
        id: FORM_DESCRIPTOR.id,
        title: FORM_DESCRIPTOR.title,
        back_end_url: req.url + FORM_DESCRIPTOR.id,
      };
    } catch (err) {
      logger.logger.error('Error reading file from disk: ', err);
      return {};
    }
  });
  res.send(result);
});

app.get('/api/forms/:formId(\\d+)', (req, res) => {
  const { formId } = req.params;
  const LIST_OF_FORM_DESCRIPTORS = fs.readdirSync(FORM_DESCRIPTORS_PATH);
  let result = null;
  LIST_OF_FORM_DESCRIPTORS.forEach((item) => {
    try {
      const data = fs.readFileSync(path.join(FORM_DESCRIPTORS_PATH, item));
      const FORM_DESCRIPTOR = JSON.parse(data);
      if (FORM_DESCRIPTOR.id === formId) {
        result = FORM_DESCRIPTOR;
      }
    } catch (err) {
      logger.logger.error('Error reading file from disk: ', err);
    }
  });

  if (result == null) {
    res.status(404)
      .json({
        err: 'Couldn\'t find the file you requested!',
      });
  } else {
    res.json(result);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
