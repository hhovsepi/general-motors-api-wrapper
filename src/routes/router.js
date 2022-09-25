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

// TODO: !!! make an error specifically for if the calls themselves fail !!!

const router = express.Router();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle API',
      description: 'Vehicle API Information',
      contact: {
        name: 'Awesome Developer'
      },
      servers: ['http://localhost:3000'],
    }
  },
  apis: ['./src/routes/router.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



router.get('/', (req, res) => {
  res.send({ message: 'Welcome to the Smartcar API!' });
});


router.get('/vehicles', (req, res) => {
  res.status(404).json(noVehicleIdError(req.path));
});

// ***** Get Vehicle Info ***** //
/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     tags:
 *       - vehicle
 *     summary: Get vehicle info
 *     description: Get vehicle info for a given vehicle id including vin, color, doorCount, and driveTrain
 *     operationId: getVehicleInfo
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The vehicle id of the vehicle to get
 *         required: true
 *         schema:
 *           type: string
 *           default: 1234
 *           enum:
 *             - 1234
 *             - 1235
 *             - 123555555
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 color:
 *                   type: string
 *                   description: The color of the vehicle
 *                 doorCount:
 *                   type: integer
 *                   description: The number of doors
 *                 driveTrain:
 *                   type: string
 *                   description: The drive train of the vehicle
 *                 vin:
 *                   type: string
 *                   description: The full Vehicle Identification Number
 *       '404':
 *         description: Invalid vehicle ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   default: 404
 *                   description: invalid vehicle ID provided
 *                 info:
 *                   type: string
 *                   default: Vehicle ID {ID} is invalid, please check your vehicle ID and try again.
 *                 type:
 *                   type: string
 *                   default: INVALID_VEHICLE_ID
 *                   description: The drive train of the vehicle
 * 
 *     
 */
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


// ***** Invalid Method or Route ***** //
router.all('*', async (req, res) => {
  await invalidMethodOrRoute(req, res);
})






export default router;
