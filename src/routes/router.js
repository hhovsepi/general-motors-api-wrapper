/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import express from 'express';
import axios from 'axios';
import { invalidVehicleIdError, noVehicleIdError, noBatteryError, noFuelError, invalidActionError, invalidRouteError, shouldBeGetError, shouldBePostError }  from '../middleware/errorHandler.js';

// TODO: make an error specifically for if the calls themselves fail

const router = express.Router();


// ***** Root ***** //
router.get('/', (res) => {
  res.send({ message: 'Welcome to the Smartcar API!' });
});

router.get('/vehicles', (req, res) => {
  res.status(404).json(noVehicleIdError(req.path));
});

// ***** Get Vehicle Info ***** //
router.get('/vehicles/:id', async (req, res) => {
  const { id } = req.params;
  const url = 'http://gmapi.azurewebsites.net/getVehicleInfoService';
  const data = {
    id,
    responseType: 'JSON'
  };
  try {
    const response = await axios.post(url, data);
    if (response.data.status === '404') { return res.status(404).json(invalidVehicleIdError(id)); }
    const vehicleInfo = {
      vin: response.data.data.vin.value,
      color: response.data.data.color.value,
      doorCount: response.data.data.fourDoorSedan.value === 'True' ? 4 : 2,
      driveTrain: response.data.data.driveTrain.value
    };
    res.json(vehicleInfo);
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', message: 'There was an error getting the vehicle info' });
  }
});

// ***** Get Security Status ***** //
router.get('/vehicles/:id/doors', async (req, res) => {
  const { id } = req.params;
  const url = 'http://gmapi.azurewebsites.net/getSecurityStatusService';
  const data = {
    id,
    responseType: 'JSON'
  };
  try {
    const response = await axios.post(url, data);
    if (response.data.status === '404') { return res.status(404).json(invalidVehicleIdError(id)); }
    const securityStatus = response.data.data.doors.values.map(door => {
      return {
        location: door.location.value,
        locked: door.locked.value === 'True'
      };
    });
    res.json(securityStatus);
  } catch (error) {
    console.error(error);
    res.json({ status: 'error' });
  }
});

// ***** Get Fuel Range ***** //
router.get('/vehicles/:id/fuel', async (req, res) => {
  const { id } = req.params;
  const url = 'http://gmapi.azurewebsites.net/getEnergyService';
  const data = {
    id,
    responseType: 'JSON'
  };
  try {
    const response = await axios.post(url, data);
    if (response.data.status === '404') { return res.status(404).json(invalidVehicleIdError(id)); }
    if (response.data.data.tankLevel.type === 'Null') { return res.status(404).json(noFuelError(id)); }
    const fuelRange = {
      percent: response.data.data.tankLevel.value
    };
    res.json(fuelRange);
  } catch (error) {
    console.error(error);
    res.json({ status: 'error' });
  }
});

// ***** Get Battery Range ***** //
router.get('/vehicles/:id/battery', async (req, res) => {
  const { id } = req.params;
  const url = 'http://gmapi.azurewebsites.net/getEnergyService';
  const data = {
    id,
    responseType: 'JSON'
  };
  try {
    const response = await axios.post(url, data);
    if (response.data.status === '404') { return res.status(404).json(invalidVehicleIdError(id)); }
    if (response.data.data.batteryLevel.type === 'Null') { return res.status(404).json(noBatteryError(id)); }
    const batteryRange = {
      percent: response.data.data.batteryLevel.value
    };
    res.json(batteryRange);
  } catch (error) {
    res.json({ status: 'error' });
  }
});

// ***** Start/Stop Engine ***** //
router.post('/vehicles/:id/engine', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const url = 'http://gmapi.azurewebsites.net/actionEngineService';
  const data = {
    id,
    command: action === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE',
    responseType: 'JSON'
  };
  if (action !== 'START' && action !== 'STOP') { return res.status(400).json(invalidActionError(action)); }
  try {
    const response = await axios.post(url, data);
    if (response.data.status === '404') { return res.status(404).json(invalidVehicleIdError(id)); }
    const actionResult = {
      status: response.data.actionResult.status
    };
    res.json(actionResult);
  } catch (error) {
    console.error(error);
    res.json({ status: 'error' });
  }
});

// ***** Invalid Method or Route ***** //
router.all('*', (req, res) => {
  const postRoutes = /\/vehicles\/\d+\/engine/;
  const getRoutes = /\/vehicles\/\d+\/doors|\/vehicles\/\d+\/fuel|\/vehicles\/\d+\/battery|\/vehicles\/\d+/;

  // ** Engine Start/Stop Must be POST ** //
  if (req.path.match(postRoutes) && req.method !== 'POST') {
    return res.status(405).json(shouldBePostError(req.method, req.path));
  }

  // ** All Other Routes Must be GET ** //
  if (req.path.match(getRoutes) && req.method !== 'GET') {
  return res.status(405).json(shouldBeGetError(req.method, req.path));
  }

  res.status(404).json(invalidRouteError(req.originalUrl));
});






export default router;
