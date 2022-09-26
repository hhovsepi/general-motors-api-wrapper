/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


import {
  getVehicleInfo,
  getSecurityStatus,
  getFuelRange,
  getBatteryRange,
  startStopEngine,
  invalidMethodOrRoute
} from './calls.js';

import { noVehicleIdError } from '../middleware/errorHandler.js';
import welcome from './welcome.js';


// ** Swagger Config for Documentation ** //
const router = express.Router();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Smartcar API Wrapper for GM',
      description: 'Documentation for the Smartcar API Wrapper for GM',
      contact: {
        name: 'Awesome Developer'
      },
      servers: ['http://localhost:3000'],
    }
  },
  apis: ['./src/routes/docs.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// ** End Swagger Config ** //


// ************** Routes ************** 

// ** Welcome Route ** //
router.get('/', (req, res) => {
  res.status(200).json(welcome);
});

// ***** Get Vehicle Info ***** //
router.get('/vehicles/:id', async (req, res) => { 
  await getVehicleInfo(req, res);
});


// ***** Get Security Status ***** //
router.get('/vehicles/:id/doors', async (req, res) => {
  await getSecurityStatus(req, res);
});


// ***** Get Fuel Range ***** //
router.get('/vehicles/:id/fuel', async (req, res) => {
  await getFuelRange(req, res);
});



// ***** Get Battery Range ***** //
router.get('/vehicles/:id/battery', async (req, res) => {
  await getBatteryRange(req, res);
});


// ***** Start/Stop Engine ***** //
router.post('/vehicles/:id/engine', async (req, res) => {
  await startStopEngine(req, res);
});

// ***** Vehicle with no ID ***** //
router.get('/vehicles', (req, res) => {
  res.status(400).json(noVehicleIdError(req.path));
});


// ***** Invalid Method or Route ***** //
router.all('*', async (req, res) => {
  await invalidMethodOrRoute(req, res);
})






export default router;
