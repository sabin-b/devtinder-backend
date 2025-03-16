import path from "path";
import swaggerJsDoc from "swagger-jsdoc";

const swaggerDocs = swaggerJsDoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "devTinder",
      version: "1.0.0",
      description: "API documentation",
    },
  },
  apis: [path.join(__dirname, "../routes/*.ts")],
});

export default swaggerDocs;
