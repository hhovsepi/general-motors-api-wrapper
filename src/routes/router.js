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
  apis: ['./src/routes/router.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



router.get('/', (req, res) => {
  res.status(200).json(welcome);
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
 *       - Vehicle Details
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
 *                 message:
 *                   type: string
 *                   default: Not Found
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       default: 404
 *                       description: invalid vehicle ID provided
 *                     info:
 *                       type: string
 *                       default: Vehicle ID {ID} is invalid, please check your vehicle ID and try again.
 *                     type:
 *                       type: string
 *                       default: INVALID_VEHICLE_ID
 *                       description: The drive train of the vehicle
 *                 timestamp:
 *                   type: string
 *                   default: 2021-03-01T00:00:00.000Z
 *                   description: The timestamp of the request
 *                 possibleRoutes:
 *                   type: array
 *                   items:
 *                     type: string
 * 
 *     
 */
router.get('/vehicles/:id', async (req, res) => { 
  await getVehicleInfo(req, res);
});


// ***** Get Security Status ***** //
/**
 * @swagger
 * /vehicles/{id}/doors:
 *   get:
 *     tags:
 *       - Vehicle Security
 *     summary: Get security status of vehicle doors
 *     description: Get security status of vehicle doors for a given vehicle id including locked status of each door
 *     operationId: getVehicleDoors
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
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   location:
 *                     type: string
 *                     default: frontLeft
 *                     description: The color of the vehicle
 *                   locked:
 *                     type: boolean
 *       '404':
 *         description: Invalid vehicle ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not Found
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       default: 404
 *                       description: invalid vehicle ID provided
 *                     info:
 *                       type: string
 *                       default: Vehicle ID {ID} is invalid, please check your vehicle ID and try again.
 *                     type:
 *                       type: string
 *                       default: INVALID_VEHICLE_ID
 *                       description: The drive train of the vehicle
 *                 timestamp:
 *                   type: string
 *                   default: 2021-03-01T00:00:00.000Z
 *                   description: The timestamp of the request
 *                 possibleRoutes:
 *                   type: array
 *                   items:
 *                     type: string
 * 
 *     
 */
router.get('/vehicles/:id/doors', async (req, res) => {
  await getSecurityStatus(req, res);
});

/**
 * @swagger
 * /vehicles/{id}/fuel:
 *   get:
 *     tags:
 *       - Vehicle Fuel
 *     summary: Get the fuel level of the vehicle
 *     description: Get the fuel level of the vehicle for a given vehicle id as a percentage
 *     operationId: getVehicleFuel
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
 *                 percent:
 *                   type: string
 *                   description: The remaining fuel level of the vehicle as a percentage
 *                   default: 27.38
 *       '404':
 *         description: Invalid vehicle ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not Found
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       default: 404
 *                       description: invalid vehicle ID provided
 *                     info:
 *                       type: string
 *                       default: Vehicle ID {ID} is invalid, please check your vehicle ID and try again.
 *                     type:
 *                       type: string
 *                       default: INVALID_VEHICLE_ID
 *                       description: The drive train of the vehicle
 *                 timestamp:
 *                   type: string
 *                   default: 2021-03-01T00:00:00.000Z
 *                   description: The timestamp of the request
 *                 possibleRoutes:
 *                   type: array
 *                   items:
 *                     type: string
 *       '406':
 *         description: Vehicle does not use fuel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not Acceptable
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       default: 406
 *                       description: vehicle energy type is invalid
 *                     info:
 *                       type: string
 *                       default: Vehicle ID 1235 does not use fuel. Path /fuel is only valid for gas or hybrid vehicles. Did you mean /battery?
 *                     type:
 *                       type: string
 *                       default: NO_FUEL
 *                 timestamp:
 *                   type: string
 *                   default: 2021-03-01T00:00:00.000Z
 *                   description: The timestamp of the request
 *                 possibleRoutes:
 *                   type: array
 *                   items:
 *                     type: string
 */
// ***** Get Fuel Range ***** //
router.get('/vehicles/:id/fuel', async (req, res) => {
  await getFuelRange(req, res);
});

/**
 * @swagger
 * /vehicles/{id}/battery:
 *   get:
 *     tags:
 *       - Vehicle Battery
 *     summary: Get the battery level of the vehicle
 *     description: Get the battery level of the vehicle for a given vehicle id as a percentage
 *     operationId: getVehicleBattery
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
 *                 percent:
 *                   type: string
 *                   description: The remaining battery level of the vehicle as a percentage
 *                   default: 27.39
 *       '404':
 *         description: Invalid vehicle ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not Found
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       default: 404
 *                       description: invalid vehicle ID provided
 *                     info:
 *                       type: string
 *                       default: Vehicle ID {ID} is invalid, please check your vehicle ID and try again.
 *                     type:
 *                       type: string
 *                       default: INVALID_VEHICLE_ID
 *                       description: The drive train of the vehicle
 *                 timestamp:
 *                   type: string
 *                   default: 2021-03-01T00:00:00.000Z
 *                   description: The timestamp of the request
 *                 possibleRoutes:
 *                   type: array
 *                   items:
 *                     type: string
 *       '406':
 *         description: Vehicle does not use battery
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not Acceptable
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       default: 406
 *                       description: vehicle energy type is invalid
 *                     info:
 *                       type: string
 *                       default: Vehicle ID 1234 does not use battery. Path /battery is only valid for electric or hybrid vehicles. Did you mean /fuel?
 *                     type:
 *                       type: string
 *                       default: NO_BATTERY
 *                 timestamp:
 *                   type: string
 *                   default: 2021-03-01T00:00:00.000Z
 *                   description: The timestamp of the request
 *                 possibleRoutes:
 *                   type: array
 *                   items:
 *                     type: string
 */
// ***** Get Battery Range ***** //
router.get('/vehicles/:id/battery', async (req, res) => {
  await getBatteryRange(req, res);
});


// ***** Start/Stop Engine ***** //
/**
 * @swagger
 * /vehicles/{id}/engine:
 *   post:
 *     tags:
 *       - Vehicle Remote Start/Stop
 *     summary: Start or stop the engine of the vehicle
 *     description: Start or stop the engine of the vehicle for a given vehicle id
 *     operationId: startStopVehicleEngine
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
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 description: The action to perform on the vehicle engine
 *                 default: START
 *                 enum:
 *                   - START
 *                   - STOP
 *                   - GO FAST GO FURIOUS
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The execution status of the action
 *                   default: EXECUTED
 *       '404':
 *         description: Invalid vehicle ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not Found
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       default: 404
 *                       description: invalid vehicle ID provided
 *                     info:
 *                       type: string
 *                       default: Vehicle ID {ID} is invalid, please check your vehicle ID and try again.
 *                     type:
 *                       type: string
 *                       default: INVALID_VEHICLE_ID
 *                       description: The drive train of the vehicle
 *                 timestamp:
 *                   type: string
 *                   default: 2021-03-01T00:00:00.000Z
 *                   description: The timestamp of the request
 *                 possibleRoutes:
 *                   type: array
 *                   items:
 *                     type: string
 *       '405':
 *         description: method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Method Not Allowed
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       default: 405
 *                       description: invalid action provided
 *                     info:
 *                       type: string
 *                       default: Method {method} is invalid for /vehicles/1234/engine - allowed methods are POST.
 *                     type:
 *                       type: string
 *                       default: INVALID_METHOD
 *                 timestamp:
 *                   type: string
 *                   default: 2021-03-01T00:00:00.000Z
 *                   description: The timestamp of the request
 *                 possibleRoutes:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post('/vehicles/:id/engine', async (req, res) => {
  await startStopEngine(req, res);
});


// ***** Invalid Method or Route ***** //
router.all('*', async (req, res) => {
  await invalidMethodOrRoute(req, res);
})






export default router;
