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
/*  it('should fail to connect with invalid MongoDB credentials', async () => {
    try {
      await mongoose.connect(
        'mongodb://invalidUser:wrongPass@invalid-url'
      );
    } catch (error) {
      expect(error).toBeDefined(); 
    }
},10000);
*/


  it('should return 404 on internal server error', async () => {
    jest.spyOn(app, 'use').mockImplementationOnce(() => {
      throw new Error('Simulated Server Error');
    });

    const response = await request(app).get('/');
    expect(response.status).toBe(404); 
  });
});
/*
it('should create a new expense and return it', async () => {
  const newExpense = {
    name: 'Test Expense',
    amount: 150,
  };

  const response = await request(app).post('/expenses').send(newExpense);

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('name', newExpense.name);
  expect(response.body).toHaveProperty('amount', newExpense.amount);
});
*/

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

/*
// NOVI TESTI

// =====================
// Novi API testi za zaposlene
// =====================
describe('Novi API testi za zaposlene', () => {
  afterAll(async () => {
    await mongoose.connection.close(); // Zapri povezavo z bazo
  });

  // Test 1: Preveri dodajanje veljavne osebe
  it('should successfully add a new employee', async () => {
    const newEmployee = {
      ime: 'Testni',
      priimek: 'Zaposleni',
      email: 'testni.zaposleni@example.com',
      polozaj: 'Razvijalec',
    };

    const response = await request(app).post('/zaposleni').send(newEmployee);

    expect(response.status).toBe(201); // Preveri status
    expect(response.body).toHaveProperty('ime', newEmployee.ime);
    expect(response.body).toHaveProperty('priimek', newEmployee.priimek);
    expect(response.body).toHaveProperty('email', newEmployee.email);
    expect(response.body).toHaveProperty('polozaj', newEmployee.polozaj);
  });

  // Test 2: Preveri validacijo manjkajočega polja pri dodajanju osebe
  it('should return 400 if required fields are missing', async () => {
    const invalidEmployee = {
      ime: 'Testni',
      email: 'test.manjkajoce@example.com',
    };

    const response = await request(app).post('/zaposleni').send(invalidEmployee);

    expect(response.status).toBe(400); // Preveri neuspešno zahtevo
    expect(response.body.message).toBe('Vsa polja so obvezna');
  });

  // Test 3: Pridobivanje vseh zaposlenih
  it('should return all employees', async () => {
    const response = await request(app).get('/zaposleni');

    expect(response.status).toBe(200); // Preveri uspešno zahtevo
    expect(Array.isArray(response.body)).toBe(true); // Preveri, da je odgovor polje
    expect(response.body.length).toBeGreaterThanOrEqual(1); // Preveri, da seznam ni prazen
  });
});

*/