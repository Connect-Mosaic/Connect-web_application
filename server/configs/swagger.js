import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesPath = path.join(__dirname, "..", "routes", "*.js");

console.log("Swagger scanning :", routesPath);
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
        tags: [
            {
                name: "Users",
                description: "User profile, settings, and general user actions"
            },
            {
                name: "Admin",
                description: "Admin-only operations and management"
            },
            {
                name: "Auth",
                description: "Login, signup, and authentication APIs"
            },
            {
                name: "Conversations",
                description: "1-to-1 and group conversation APIs"
            },
            {
                name: "Messages",
                description: "Message sending, fetching, deleting, and read status"
            },
            {
                name: "Events",
                description: "Event listing, details, joining, and map coordinates"
            },
            {
                name: "Search",
                description: "Search APIs for users, events, and locations"
            }
        ]
    },
    apis: [routesPath],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiMiddleware = swaggerUi;
