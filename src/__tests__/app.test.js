import express from 'express';
import request from 'supertest';
import router from '../routes/router.js';



// eslint-disable-next-line new-cap
const app = new express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', router);

// ** Welcome route should return a 200 status code and a welcome message ** //
describe('GET /', () => {
  it('should return a 200 status code & welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

// ** /vehicle with no id should return a 400 status code and an error message ** //
describe('GET /vehicles', () => {
  it('No Vehicle ID: Should return a 400 status code', async () => {
    const response = await request(app).get('/vehicles');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.success).toBe(false);
  });
});

describe('GET /vehicles/:id', () => {
  it('Should return all required data', async () => {
    const response = await request(app).get('/vehicles/1234');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('vin');
    expect(response.body).toHaveProperty('color');
    expect(response.body).toHaveProperty('doorCount');
    expect(response.body).toHaveProperty('driveTrain');
  });
  it('Invalid Vehicle ID: Should return a 404 status code', async () => {
    const response = await request(app).get('/vehicles/12345');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.success).toBe(false);
  }
  );
});

describe('GET /vehicles/:id/doors', () => {
  it('Should return all required data - 4 doors', async () => {
    const response = await request(app).get('/vehicles/1234/doors');
    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty('location');
    expect(response.body[0]).toHaveProperty('locked');
    expect(response.body).toHaveLength(4);
  });
  it('Should return all required data - 2 doors', async () => {
    const response = await request(app).get('/vehicles/1235/doors');
    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty('location');
    expect(response.body[0]).toHaveProperty('locked');
    expect(response.body).toHaveLength(2);
  });
  it('Invalid Vehicle ID: Should return a 404 status code', async () => {
    const response = await request(app).get('/vehicles/12345/doors');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.success).toBe(false);
  });
});

describe('GET /vehicles/:id/fuel', () => {
  it('Should return all required data', async () => {
    const response = await request(app).get('/vehicles/1234/fuel');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('percent');
  });
  it('Invalid Vehicle ID: Should return a 404 status code', async () => {
    const response = await request(app).get('/vehicles/12345/fuel');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.success).toBe(false);
  });
  it('Car does not take fuel: Should return a 406 status code', async () => {
    const response = await request(app).get('/vehicles/1235/fuel');
    expect(response.statusCode).toBe(406);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error.type).toBe('NO_FUEL');
    expect(response.body.success).toBe(false);
  }
  );
});

describe('GET /vehicles/:id/battery', () => {
  it('Should return all required data', async () => {
    const response = await request(app).get('/vehicles/1235/battery');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('percent');
  });
  it('Invalid Vehicle ID: Should return a 404 status code', async () => {
    const response = await request(app).get('/vehicles/12345/battery');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.success).toBe(false);
  });
  it('Car does not have battery: Should return a 406 status code', async () => {
    const response = await request(app).get('/vehicles/1234/battery');
    expect(response.statusCode).toBe(406);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error.type).toBe('NO_BATTERY');
    expect(response.body.success).toBe(false);
  }
  );
});

describe('POST /vehicles/:id/engine', () => {
  it('Should start the engine or run recursively until success', async () => {
    const response = await request(app).post('/vehicles/1234/engine').send({ action: 'START' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('EXECUTED');
  });
  it('Should stop the engine or run recursively until success', async () => {
    const response = await request(app).post('/vehicles/1234/engine').send({ action: 'STOP' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('EXECUTED');
  });
  it('Invalid Vehicle ID: Should return a 404 status code', async () => {
    const response = await request(app).post('/vehicles/12345/engine').send({ action: 'START' });
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.success).toBe(false);
  });
  it('Invalid Action: Should return a 400 status code', async () => {
    const response = await request(app).post('/vehicles/1234/engine').send({ action: 'STARTS' });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.success).toBe(false);
  });
});

describe('POST /vehicles/:id/doors', () => {
  it('Invalid Method: Should throw 405', async () => {
    const response = await request(app).post('/vehicles/1234/doors');
    expect(response.statusCode).toBe(405);
    expect(response.body.message).toBe('Method Not Allowed');
    expect(response.body.success).toBe(false);
  });
});

describe('POST /vehicles/:id/fuel', () => {
  it('Invalid Method: Should throw 405', async () => {
    const response = await request(app).post('/vehicles/1234/fuel');
    expect(response.statusCode).toBe(405);
    expect(response.body.message).toBe('Method Not Allowed');
    expect(response.body.success).toBe(false);
  });
});

describe('POST /vehicles/:id/battery', () => {
  it('Invalid Method: Should throw 405', async () => {
    const response = await request(app).post('/vehicles/1234/battery');
    expect(response.statusCode).toBe(405);
    expect(response.body.message).toBe('Method Not Allowed');
    expect(response.body.success).toBe(false);
  });
});

describe('GET /vehicles/:id/engine', () => {
  it('Invalid Method: Should throw 405', async () => {
    const response = await request(app).get('/vehicles/1234/engine');
    expect(response.statusCode).toBe(405);
    expect(response.body.message).toBe('Method Not Allowed');
    expect(response.body.success).toBe(false);
  });
});

// timeout for async functions
jest.setTimeout(30000);





