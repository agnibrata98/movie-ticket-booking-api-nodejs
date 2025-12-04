import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Ticket Booking API",
      version: "1.0.0",
      description: "API documentation for Movie Ticket Booking System",
      contact: {
        name: "Developer",
      },
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER || "/api",
        description: "API server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },

  // path where API route files exist
  apis: ["./app/routers/api/*.ts"],
};

export const swaggerSpec = swaggerJsDoc(swaggerOptions);

export const swaggerDocs = (app: any) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log("📘 Swagger API Docs available at: /api/docs");
};
