// pages/api/doc.js
import { withSwagger } from "next-swagger-doc";
const swaggerHandler = withSwagger({
  openApiVersion: "3.0.0",
  title: "Film API Swagger",
  version: "1.0.0",
  apiFolder: "pages/api",
});
export default swaggerHandler();
