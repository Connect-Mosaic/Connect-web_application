import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const routesPath = path.join(process.cwd(), "routes/*.js");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Connect Project API Documentation",
            version: "1.0.0",
            description: "API docs for Connect project",
        },
        servers: [
            {
                url: "http://localhost:3000/api",
                description: "Local Dev Server",
            },
        ],
    },
    apis: [routesPath],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiMiddleware = swaggerUi;
