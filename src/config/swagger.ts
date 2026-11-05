import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node.js TypeScript API',
            version: '1.0.0',
            description: 'Docs API backend',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Server dev',
            },
        ],
    },
    // Path to the files where you include JSDoc comments containing route specifications
    apis: ['./src/routes/*.ts', './src/modules/**/*.ts', './src/server.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);