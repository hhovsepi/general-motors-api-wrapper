import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http.js';

import { invalidVehicleIdError, noBatteryError, noFuelError, invalidActionError, shouldBeGetError, shouldBePostError, invalidRouteError }  from '../middleware/errorHandler.js';

axios.defaults.adapter = httpAdapter;

// ***** Get Vehicle Info ***** //
export const getVehicleInfo = async (req, res) => {
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
    return res.json(vehicleInfo);
  } catch (error) {
    console.error(error);
    return res.json({ status: 'error', message: 'There was an error getting the vehicle info' });
  }
};

// ***** Get Security Status ***** //
export const getSecurityStatus = async (req, res) => {
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
    return res.json(securityStatus);
  } catch (error) {
    console.error(error);
    return res.json({ status: 'error', message: 'There was an error getting the security status' });
  }
};

// ***** Get Fuel Range ***** //
export const getFuelRange = async (req, res) => {
  const { id } = req.params;
  const url = 'http://gmapi.azurewebsites.net/getEnergyService';
  const data = {
    id,
    responseType: 'JSON'
  };
  try {
    const response = await axios.post(url, data);
    if (response.data.status === '404') { return res.status(404).json(invalidVehicleIdError(id)); }
    if (response.data.data.tankLevel.type === 'Null') { return res.status(406).json(noFuelError(id)); }
    const fuelRange = {
      percent: response.data.data.tankLevel.value
    };
    return res.json(fuelRange);
  } catch (error) {
    console.error(error);
    return res.json({ status: 'error', message: 'There was an error getting the fuel range' });
  }
};

// ***** Get Battery Range ***** //
export const getBatteryRange = async (req, res) => {
  const { id } = req.params;
  const url = 'http://gmapi.azurewebsites.net/getEnergyService';
  const data = {
    id,
    responseType: 'JSON'
  };
  try {
    const response = await axios.post(url, data);
    if (response.data.status === '404') { return res.status(404).json(invalidVehicleIdError(id)); }
    if (response.data.data.batteryLevel.type === 'Null') { return res.status(406).json(noBatteryError(id)); }
    const batteryRange = {
      percent: response.data.data.batteryLevel.value
    };
    return res.json(batteryRange);
  } catch (error) {
    console.error(error);
    return res.json({ status: 'error', message: 'There was an error getting the battery range' });
  }
};

// ***** Start/Stop Engine ***** //
export const startStopEngine = async (req, res) => {
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
    return res.json(actionResult);
  } catch (error) {
    console.error(error);
    return res.json({ status: 'error', message: 'There was an error starting/stopping the engine' });
  }
};

// ***** Invalid Route or Method ***** //
export const invalidMethodOrRoute = (req, res) => {
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
  return res.status(404).json(invalidRouteError(req.originalUrl));
};


export default {
  getVehicleInfo,
  getSecurityStatus,
  getFuelRange,
  getBatteryRange,
  startStopEngine,
  invalidMethodOrRoute
};


