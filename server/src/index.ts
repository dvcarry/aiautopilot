// Полифилл для Object.hasOwn (для совместимости с Node.js < 16.9.0)
if (!Object.hasOwn) {
  Object.hasOwn = function(obj: any, prop: string | symbol) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}

// Загружаем переменные окружения в самом начале
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
const app = express();
import cors from "cors";
import path from "path";

import { sequelize } from "./db/db";
import "./models/Replica"; // Импортируем модель для регистрации
import "./models/Answer"; // Импортируем модель Answer для регистрации
import replicaRoutes from "./routes/replicaRoutes";
import chatRoutes from "./routes/chatRoutes";
import answerRoutes from "./routes/answerRoutes";

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Роуты
app.use("/api/replicas", replicaRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/answers", answerRoutes);


app.use(express.static(path.join(__dirname, '../../client/dist')));

// SPA fallback: корень и любые пути отдают index.html (/*path не матчит "/", поэтому явно добавляем "/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});
app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});

// Обработчик для несуществующих маршрутов (должен быть в самом конце)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "failed",
    message: `Route: ${req.originalUrl} does not exist on this server`,
  });
});

const PORT = process.env.PORT || 5231;

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection! ${process.env.POSTGRES_DB}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:", error);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();
  console.log(`Starting Sequelize + Express on port ${PORT}...`);

  app.listen(PORT, () => {
    console.log(
      `Express server started on port ${PORT} and status ${process.env.TS_NODE_DEV ? "DEVELOPMENT" : "PRODUCTION"}`
    );
  });
}

init();

