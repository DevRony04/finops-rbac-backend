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
        url: 'https://finops-rbac-backend.onrender.com',
        description: 'Production Server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
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
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', example: 'Password123!' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string', enum: ['ADMIN', 'ANALYST', 'VIEWER'] },
              },
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: { type: 'string', format: 'email', example: 'newuser@example.com' },
            password: { type: 'string', minLength: 8, example: 'SecurePass123!' },
            name: { type: 'string', example: 'John Doe' },
          },
        },
        FinancialRecord: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            description: { type: 'string' },
            amount: { type: 'number' },
            category: { type: 'string' },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            date: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateRecordRequest: {
          type: 'object',
          required: ['description', 'amount', 'category', 'type'],
          properties: {
            description: { type: 'string', example: 'Monthly Salary' },
            amount: { type: 'number', example: 5000 },
            category: { type: 'string', example: 'Salary' },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'INCOME' },
            date: { type: 'string', format: 'date', example: '2024-04-05' },
          },
        },
        UpdateRecordRequest: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            amount: { type: 'number' },
            category: { type: 'string' },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            date: { type: 'string', format: 'date' },
          },
        },
        DashboardSummary: {
          type: 'object',
          properties: {
            totalIncome: { type: 'number', example: 50000 },
            totalExpense: { type: 'number', example: 30000 },
            netBalance: { type: 'number', example: 20000 },
            recordCount: { type: 'number', example: 150 },
          },
        },
        TrendData: {
          type: 'object',
          properties: {
            month: { type: 'string', example: '2024-04' },
            income: { type: 'number', example: 5000 },
            expense: { type: 'number', example: 3000 },
            net: { type: 'number', example: 2000 },
          },
        },
        CategoryData: {
          type: 'object',
          properties: {
            category: { type: 'string', example: 'Food' },
            amount: { type: 'number', example: 1500 },
            percentage: { type: 'number', example: 15.5 },
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
