import createError from 'http-errors';

const possibleRoutes = ['GET /vehicles/:id', 'GET /vehicles/:id/doors', 'GET /vehicles/:id/fuel', 'GET /vehicles/:id/battery', 'POST /vehicles/:id/engine'];


// ** Vehicle ID Error 404 ** //
export const invalidVehicleIdError = (id) => createError(404, {
  'success': false,
  'error': {
    'code': '404',
    'type': 'INVALID_VEHICLE_ID',
    'info': `Vehicle ID ${id} is invalid, please check your vehicle ID and try again.`,
  },
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// *** No Vehicle ID Provided Error 400 *** //
export const noVehicleIdError = (path) => createError(400, {
  'success': false,
  'error': {
    'code': '404',
    'type': 'NO_VEHICLE_ID',
    'info': 'No vehicle ID was provided, please provide a vehicle ID and try again.',
    'incompletePath': path,
    'examplePath': '/vehicles/1587',
  },
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Battery Error 406 ** //
export const noBatteryError = (id) => createError(406, {
  'success': false,
  'error': {
    'code': '406',
    'type': 'NO_BATTERY',
    'info': `Vehicle ID ${id} does not use a battery. Path /battery is only valid for electric or hybrid vehicles. Did you mean /fuel?`,
  },
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Fuel Error 406 ** //
export const noFuelError = (id) => createError(406, {
  'success': false,
  'error': {
    'code': '406',
    'type': 'NO_FUEL',
    'info': `Vehicle ID ${id} does not use fuel. Path /fuel is only valid for gas or hybrid vehicles. Did you mean /battery?`,
  },
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Engine Action Error 400 ** //
export const invalidActionError = (action) => createError(400, {
  'success': false,
  'error': {
    'code': '400',
    'type': 'INVALID_ACTION',
    'info': `Action ${action} is invalid. Allowed actions are START and STOP for the /engine endpoint.`,
  },
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Route Error 404 ** //
export const invalidRouteError = (path) => createError(404, {
  'success': false,
  'error': {
    'code': '404',
    'type': 'INVALID_ROUTE',
    'info': `Route ${path} is invalid. Please check your route and try again.`,
  },
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Method - Must be GET 405 ** //
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
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** Invalid Method - Must be POST 405 ** //
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
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});

// ** API Specific Error 500 ** //
export const apiError = (endpoint) => createError(500, {
  'success': false,
  'error': {
    'code': '500',
    'type': 'API_ERROR',
    'info': `There was an error with the API endpoint ${endpoint}. This has been logged and will be investigated. Please try again later or contact the API administrator.`,
  },
  'timestamp': new Date().toISOString(),
  'possibleRoutes': possibleRoutes
});


