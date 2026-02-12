import express, { Request, Response } from "express";
import fetch from "node-fetch";
import Answer from "../models/Answer";

const router = express.Router();

// Интерфейс для запроса к внешнему API
interface ChatRequest {
  message: string;
}

// Внешний API возвращает plain text ответ

router.post("/", async (req: Request, res: Response) => {
  try {
    const { message }: ChatRequest = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Сообщение не может быть пустым"
      });
    }

    console.log("Отправка запроса к внешнему API:", message);

    // Отправляем запрос к внешнему API
    const response = await fetch("http://87.228.65.184:11460/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Autopilot",
        message: message
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    
    console.log("Получен ответ от внешнего API:", data);

    // Сохраняем вопрос и ответ в базу данных
    try {
      await Answer.create({
        question: message,
        answer: data || "Получен пустой ответ от сервера",
        status: "new"
      });
      console.log("Вопрос и ответ сохранены в базу данных");
    } catch (dbError) {
      console.error("Ошибка при сохранении в базу данных:", dbError);
      // Продолжаем выполнение, даже если не удалось сохранить в БД
    }

    // Возвращаем ответ клиенту
    res.json({
      status: "success",
      response: data || "Получен пустой ответ от сервера"
    });

  } catch (error) {
    console.error("Ошибка при обращении к внешнему API:", error);
    
    res.status(500).json({
      status: "error",
      message: "Ошибка при обращении к внешнему сервису",
      details: error instanceof Error ? error.message : "Неизвестная ошибка"
    });
  }
});

export default router;