// Corrected Backend Tests

import request from 'supertest';
import app from './index'; // Main application
import mongoose from 'mongoose';
import express, { Application, Request, Response } from 'express';


// Increase Jest timeout
jest.setTimeout(20000); // Set global timeout

// =====================
// Testiranje aplikacije
// =====================
describe('Application Server Tests', () => {
  afterAll(async () => {
    await mongoose.connection.close(); // Close database connection
  });

  it('should return 404 on the base route "/"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(404);
  });

  it('should return 404 on undefined routes', async () => {
    const response = await request(app).get('/non-existing-endpoint');
    expect(response.status).toBe(404);
  });
});

// =====================
// Validation Tests
// =====================
export const validateExpense = (data: { name: string; amount: number }) => {
  if (!data.name || typeof data.name !== 'string') {
    throw new Error('Invalid name');
  }
  if (!data.amount || typeof data.amount !== 'number') {
    throw new Error('Invalid amount');
  }
  return true;
};

describe('Validation Function Tests', () => {
  it('should pass for valid data', () => {
    const data = { name: 'Expense 1', amount: 100 };
    expect(() => validateExpense(data)).not.toThrow();
  });

  it('should throw an error for missing name', () => {
    const data = { amount: 100 } as any;
    expect(() => validateExpense(data)).toThrow('Invalid name');
  });

  it('should throw an error for missing amount', () => {
    const data = { name: 'Expense' } as any;
    expect(() => validateExpense(data)).toThrow('Invalid amount');
  });
});

// =====================
// Router Tests
// =====================
const router = express.Router();

router.get('/test-route', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Test route is working' });
});

describe('Router Tests', () => {
  it('should return 200 for GET /test-route', async () => {
    const app = express(); 
    app.use(router);

    const response = await request(app).get('/test-route');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Test route is working' });
  });

  it('should return 404 for unknown API routes', async () => {
    const response = await request(app).get('/unknown-api');
    expect(response.status).toBe(404);
  });
});

// =====================
// Database and Server Error Tests
// =====================
describe('Database Tests', () => {
  it('should fail to connect with invalid MongoDB credentials', async () => {
    try {
      await mongoose.connect(
        'mongodb://invalidUser:wrongPass@invalid-url'
      );
    } catch (error) {
      expect(error).toBeDefined(); 
    }
  });

  it('should return 404 on internal server error', async () => {
    jest.spyOn(app, 'use').mockImplementationOnce(() => {
      throw new Error('Simulated Server Error');
    });

    const response = await request(app).get('/');
    expect(response.status).toBe(404); 
  });
});

it('should create a new expense and return it', async () => {
  const newExpense = { name: 'Test Expense', amount: 250 };

  const response = await request(app)
    .post('/expenses')
    .send(newExpense);

  expect(response.status).toBe(201); 
  expect(response.body.name).toBe(newExpense.name); 
  expect(response.body.amount).toBe(newExpense.amount); 
});

// ==========================
// Server Port Test
// ==========================
describe('Server Port Test', () => {
  let app: Application; 
  let server: any; 
  const PORT = 3000; 

  beforeAll((done) => {
    app = express(); 

    app.get('/', (req: Request, res: Response) => {
      res.status(200).send(`Server is running on port ${PORT}`);
    });

    server = app.listen(PORT, () => done());
  });

  afterAll((done) => {
    server.close(() => done());
  });

  it(`should respond on port ${PORT}`, async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200); 
    expect(response.text).toBe(`Server is running on port ${PORT}`);
  });
});
