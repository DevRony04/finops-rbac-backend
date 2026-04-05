import swaggerJSDoc from 'swagger-jsdoc';
import { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Data Processing and Access Control API',
      version: '1.0.0',
      description: 'A production-grade financial data management system with Role-Based Access Control (RBAC)',
      contact: {
        name: 'Deepyaman Mondal',
        url: 'https://rony-portfolio-site.vercel.app',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
      {
        url: 'https://finops-rbac-backend.onrender.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in format: Bearer <token>',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          description: 'Standardized error response structure',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Human-readable error message',
                  example: 'Resource not found',
                },
                code: {
                  type: 'string',
                  description: 'Internal error category code',
                  example: 'NOT_FOUND',
                },
                details: {
                  type: 'object',
                  description: 'Additional structured error details (optional)',
                  example: { id: 'uuid-1234' },
                },
              },
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'admin@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              example: 'Password123!',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT authorization token',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
                    email: { type: 'string', example: 'admin@example.com' },
                    name: { type: 'string', example: 'Admin User' },
                    role: { type: 'string', enum: ['ADMIN', 'ANALYST', 'VIEWER'], example: 'ADMIN' },
                  },
                },
              },
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'newuser@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              description: 'Strong password (min 8 chars)',
              example: 'SecurePass123!',
            },
            name: {
              type: 'string',
              description: 'Full name of the user',
              example: 'John Doe',
            },
          },
        },
        FinancialRecord: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            description: { type: 'string', description: 'Brief description of the transaction', example: 'Monthly Salary' },
            amount: { type: 'number', description: 'Transaction value', example: 5000.00 },
            category: { type: 'string', description: 'Transaction category', example: 'Salary' },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'INCOME' },
            date: { type: 'string', format: 'date-time', description: 'Transaction timestamp', example: '2024-04-05T10:00:00Z' },
            userId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateRecordRequest: {
          type: 'object',
          required: ['description', 'amount', 'category', 'type'],
          properties: {
            description: { type: 'string', description: 'Brief description of the transaction', example: 'Monthly Salary' },
            amount: { type: 'number', minimum: 0.01, example: 5000 },
            category: { type: 'string', example: 'Salary' },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'INCOME' },
            date: { type: 'string', format: 'date', description: 'Transaction date (YYYY-MM-DD)', example: '2024-04-05' },
          },
        },
        UpdateRecordRequest: {
          type: 'object',
          properties: {
            description: { type: 'string', example: 'Updated Salary' },
            amount: { type: 'number', example: 5500 },
            category: { type: 'string', example: 'Bonus' },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            date: { type: 'string', format: 'date', example: '2024-04-06' },
          },
        },
        DashboardSummary: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                totalIncome: { type: 'number', description: 'Sum of all income records', example: 50000 },
                totalExpense: { type: 'number', description: 'Sum of all expense records', example: 30000 },
                netBalance: { type: 'number', description: 'Difference between total income and expenses', example: 20000 },
                recordCount: { type: 'number', description: 'Total number of records processed', example: 150 },
              },
            },
          },
        },
        TrendData: {
          type: 'object',
          properties: {
            month: { type: 'string', description: 'Billing month (YYYY-MM)', example: '2024-04' },
            income: { type: 'number', example: 5000 },
            expense: { type: 'number', example: 3000 },
            net: { type: 'number', example: 2000 },
          },
        },
        CategoryData: {
          type: 'object',
          properties: {
            category: { type: 'string', example: 'Food' },
            amount: { type: 'number', description: 'Total spent in this category', example: 1500 },
            percentage: { type: 'number', description: 'Percentage of total expenses', example: 15.5 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Authentication', description: 'User authentication and registration' },
      { name: 'Financial Records', description: 'CRUD operations for financial records' },
      { name: 'Dashboard', description: 'Analytics and summary endpoints' },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './dist/routes/*.js',
    './dist/controllers/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Finance RBAC API Documentation',
  }));

  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
