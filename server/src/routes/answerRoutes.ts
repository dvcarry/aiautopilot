import express, { Request, Response } from "express";
import Answer from "../models/Answer";

const router = express.Router();

// Получить все ответы
router.get("/", async (req: Request, res: Response) => {
  try {
    const answers = await Answer.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({
      status: "success",
      data: answers,
    });
  } catch (error) {
    console.error("Ошибка при получении ответов:", error);
    res.status(500).json({
      status: "error",
      message: "Ошибка при получении ответов",
    });
  }
});

// Получить ответ по ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findByPk(id);

    if (!answer) {
      return res.status(404).json({
        status: "error",
        message: "Ответ не найден",
      });
    }

    res.json({
      status: "success",
      data: answer,
    });
  } catch (error) {
    console.error("Ошибка при получении ответа:", error);
    res.status(500).json({
      status: "error",
      message: "Ошибка при получении ответа",
    });
  }
});

// Обновить статус ответа
router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: "error",
        message: "Статус не может быть пустым",
      });
    }

    const answer = await Answer.findByPk(id);

    if (!answer) {
      return res.status(404).json({
        status: "error",
        message: "Ответ не найден",
      });
    }

    await answer.update({ status });

    res.json({
      status: "success",
      data: answer,
    });
  } catch (error) {
    console.error("Ошибка при обновлении статуса:", error);
    res.status(500).json({
      status: "error",
      message: "Ошибка при обновлении статуса",
    });
  }
});

// Удалить ответ
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findByPk(id);

    if (!answer) {
      return res.status(404).json({
        status: "error",
        message: "Ответ не найден",
      });
    }

    await answer.destroy();

    res.json({
      status: "success",
      message: "Ответ удален",
    });
  } catch (error) {
    console.error("Ошибка при удалении ответа:", error);
    res.status(500).json({
      status: "error",
      message: "Ошибка при удалении ответа",
    });
  }
});

export default router;