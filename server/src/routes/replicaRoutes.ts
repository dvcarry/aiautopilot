import express, { Request, Response } from "express";
import Replica from "../models/Replica";

const router = express.Router();

// Получить все реплики
router.get("/", async (req: Request, res: Response) => {
  try {
    const replicas = await Replica.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({
      status: "success",
      data: replicas,
    });
  } catch (error) {
    console.error("Ошибка при получении реплик:", error);
    res.status(500).json({
      status: "error",
      message: "Ошибка при получении реплик",
    });
  }
});

// Создать новую реплику
router.post("/", async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Содержимое реплики не может быть пустым",
      });
    }

    const replica = await Replica.create({ content });

    res.status(201).json({
      status: "success",
      data: replica,
    });
  } catch (error) {
    console.error("Ошибка при создании реплики:", error);
    res.status(500).json({
      status: "error",
      message: "Ошибка при создании реплики",
    });
  }
});

export default router;