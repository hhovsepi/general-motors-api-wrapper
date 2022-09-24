/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import express from 'express';

import {
  getVehicleInfo,
  getSecurityStatus,
  getFuelRange,
  getBatteryRange,
  startStopEngine,
  invalidMethodOrRoute
} from './calls.js';

import { noVehicleIdError } from '../middleware/errorHandler.js';

// TODO: make an error specifically for if the calls themselves fail

const router = express.Router();


// ***** Root ***** //
router.get('/', (req, res) => {
  res.send({ message: 'Welcome to the Smartcar API!' });
});

router.get('/vehicles', (req, res) => {
  res.status(404).json(noVehicleIdError(req.path));
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


// ***** Invalid Method or Route ***** //
router.all('*', async (req, res) => {
  await invalidMethodOrRoute(req, res);
})






export default router;
