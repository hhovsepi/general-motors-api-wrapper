import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http.js';

import { invalidVehicleIdError, noBatteryError, noFuelError, invalidActionError, shouldBeGetError, shouldBePostError, invalidRouteError, apiError }  from '../middleware/errorHandler.js';

axios.defaults.adapter = httpAdapter; // ** This is required for the tests to work because of the way axios is mocked ** //

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
     // ** If the vehicle ID is invalid, return an error
    const vehicleInfo = {
      vin: response.data.data.vin.value,
      color: response.data.data.color.value,
      doorCount: response.data.data.fourDoorSedan.value === 'True' ? 4 : 2, // ** If fourDoorSedan is true, return 4, else it is a twoDoorCoupe and return 2
      driveTrain: response.data.data.driveTrain.value
    };
    return res.json(vehicleInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json(apiError(req.path));
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
    // ** If the vehicle ID is invalid, return an error
    const securityStatus = response.data.data.doors.values.map(door => {
      return {
        location: door.location.value,
        locked: door.locked.value === 'True' // ** If locked is true, return true, else return false
      };
    });
    return res.json(securityStatus);
  } catch (error) {
    console.error(error);
    return res.status(500).json(apiError(req.path));
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
    // ** If the vehicle ID is invalid, return an error
    if (response.data.data.tankLevel.type === 'Null') { return res.status(406).json(noFuelError(id)); }
    // ** If the vehicle does not have fuel, return an error
    const fuelRange = {
      percent: response.data.data.tankLevel.value
    };
    return res.json(fuelRange);
  } catch (error) {
    console.error(error);
    return res.status(500).json(apiError(req.path));
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
     // ** If the vehicle ID is invalid, return an error
    if (response.data.data.batteryLevel.type === 'Null') { return res.status(406).json(noBatteryError(id)); }
    // ** If the vehicle has no battery, return an error
    const batteryRange = {
      percent: response.data.data.batteryLevel.value
    };
    return res.json(batteryRange);
  } catch (error) {
    console.error(error);
    return res.status(500).json(apiError(req.path));
  }
};

// ***** Start/Stop Engine ***** //
export const startStopEngine = async (req, res) => {
  const { id } = req.params;
  let { action } = req.body
  // ** standardize 'start' and 'stop' if passed in with different casing
  action = action.toUpperCase();
  const url = 'http://gmapi.azurewebsites.net/actionEngineService';
  const data = {
    id,
    command: action === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE',
    responseType: 'JSON'
  }; // ** The API expects the command to be in all caps

  if (action !== 'START' && action !== 'STOP') { return res.status(400).json(invalidActionError(action)); } 
  // ** The API only accepts START or STOP as the action, so if it's not one of those, return an error
  try {
    const response = await axios.post(url, data);
    if (response.data.status === '404') { return res.status(404).json(invalidVehicleIdError(id)); }
    // ** If the vehicle ID is invalid, return an error
    const actionResult = {
      status: response.data.actionResult.status
    };
    // ** some fancy recursion if the operation fails with boundaries so no infinite loop
    let counter = 0;
    if (actionResult.status === 'FAILED' && counter <= 5) {
      const retry = async () => {
        const retryResponse = await axios.post(url, data);
        if (retryResponse.data.actionResult.status === 'EXECUTED') {
          actionResult.status = retryResponse.data.actionResult.status;
        } else {
          counter += 1;
          await retry();
        }
      };
      await retry();
    }
    return res.json(actionResult);
  } catch (error) {
    console.error(error);
    return res.status(500).json(apiError(req.path));
  }
};

// ***** Invalid Route or Method ***** //
export const invalidMethodOrRoute = (req, res) => {
  // ** Regex is the cleanest way to match a route
  const postRoutes = /\/vehicles\/\d+\/engine/;
  const getRoutes = /\/vehicles\/\d+\/doors|\/vehicles\/\d+\/fuel|\/vehicles\/\d+\/battery|\/vehicles\/\d+/;
  // ** Engine Start/Stop Must be POST 
  if (req.path.match(postRoutes) && req.method !== 'POST') {
    return res.status(405).json(shouldBePostError(req.method, req.path));
  }
  // ** All Other Routes Must be GET 
  if (req.path.match(getRoutes) && req.method !== 'GET') {
    return res.status(405).json(shouldBeGetError(req.method, req.path));
  }
  // ** Invalid routes get the generic 404
  return res.status(404).json(invalidRouteError(req.originalUrl));
};


