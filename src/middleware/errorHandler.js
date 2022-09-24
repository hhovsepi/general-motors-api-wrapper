// const createError = require('http-errors'); change to import
import createError from 'http-errors';

const possibleRoutes = ['GET /vehicles/:id', 'GET /vehicles/:id/doors', 'GET /vehicles/:id/fuel', 'GET /vehicles/:id/battery', 'POST /vehicles/:id/engine'];


// ** Vehicle ID Error ** //
export const invalidVehicleIdError = (id) => createError(404, {
  'success': false,
  'error': {
    'code': '404',
    'type': 'INVALID_VEHICLE_ID',
    'info': `Vehicle ID ${id} is invalid, please check your vehicle ID and try again.`,
  },
  'path': '/vehicles/:id',
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// *** No Vehicle ID Provided Error *** //
export const noVehicleIdError = (path) => createError(404, {
  'success': false,
  'error': {
    'code': '404',
    'type': 'NO_VEHICLE_ID',
    'info': 'No vehicle ID was provided, please provide a vehicle ID and try again.',
    'incompletePath': path,
    'examplePath': '/vehicles/1587',
  },
  'path': '/vehicles/:id',
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Battery Error ** //
export const noBatteryError = (id) => createError(404, {
  'success': false,
  'error': {
    'code': '404',
    'type': 'NO_BATTERY',
    'info': `Vehicle ID ${id} does not use a battery. Path /battery is only valid for electric or hybrid vehicles. Did you mean /fuel?`,
  },
  'path': '/vehicles/:id/battery',
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Fuel Error ** //
export const noFuelError = (id) => createError(404, {
  'success': false,
  'error': {
    'code': '404',
    'type': 'NO_FUEL',
    'info': `Vehicle ID ${id} does not use fuel. Path /fuel is only valid for gas or hybrid vehicles. Did you mean /battery?`,
  },
  'path': '/vehicles/:id/fuel',
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Engine Action Error ** //
export const invalidActionError = (action) => createError(400, {
  'success': false,
  'error': {
    'code': '400',
    'type': 'INVALID_ACTION',
    'info': `Action ${action} is invalid. Allowed actions are START and STOP for the /engine endpoint.`,
  },
  'path': '/vehicles/:id/engine',
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Route Error ** //
export const invalidRouteError = (path) => createError(404, {
  'success': false,
  'error': {
    'code': '404',
    'type': 'INVALID_ROUTE',
    'info': `Route ${path} is invalid. Please check your route and try again.`,
  },
  'path': path,
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Method - Must be GET ** //
export const shouldBeGetError = (method, path) => createError(405, {
  'success': false,
  'error': {
    'code': '405',
    'type': 'INVALID_METHOD',
    'info': `Method ${method} is invalid for ${path} - allowed methods are GET.`,
    'invalidMethod': method,
    'acceptableMethods': ['GET']
    // ?? I know that objects are not ordered in JS, so how can I make sure that invalidMethod and acceptableMethods are always in the same order?
  },
  'path': path,
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Method - Must be POST ** //
export const shouldBePostError = (method, path) => createError(405, {
  'success': false,
  'error': {
    'code': '405',
    'type': 'INVALID_METHOD',
    'info': `Method ${method} is invalid for ${path} - allowed methods are POST.`,
    'invalidMethod': method,
    'acceptableMethods': ['POST']
  },
  // ?? I know that objects are not ordered in JS, so how can I make sure that invalidMethod and acceptableMethods are always in the same order?
  'path': path,
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});
