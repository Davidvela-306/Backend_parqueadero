import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import routerParqueaderos from "./routes/parqueadero_routes.js";
import routerUsuarios from "./routes/usuario_routes.js";
import routerGuardias from "./routes/guardia_routes.js";
import routerAdministrador from "./routes/administrador_routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { options } from "../src/swagger.js";

// Inicializaciones
const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: "*",
  },
});

dotenv.config();

// Configuraciones
const PORT = process.env.PORT || 4000;
app.set("port", PORT);

// CORS configurado específicamente
app.use(
  cors({
    origin: ["https://timely-crepe-9d2886.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Si se requiere el uso de cookies o autenticación
  })
);

// Manejo de preflight (OPTIONS)
app.options("*", cors());

// Middlewares
app.use(express.json());
const spect = swaggerJSDoc(options);

// Rutas
app.use("/api", routerParqueaderos);
app.use("/api", routerUsuarios);
app.use("/api", routerGuardias);
app.use("/api", routerAdministrador);

app.get("/", (req, res) => {
  res.send("Bienvenido al backend");
});

// Documentación
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spect));

// Endpoint no encontrado
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// Depuración de solicitudes (opcional, solo para pruebas)
app.use((req, res, next) => {
  console.log("Solicitud recibida:", req.method, req.path);
  next();
});

export { httpServer, app };
