import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/db";

export interface AnswerAttributes {
  id?: number;
  question: string;
  answer: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Answer extends Model<AnswerAttributes> implements AnswerAttributes {
  public id!: number;
  public question!: string;
  public answer!: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Answer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "new",
    },
  },
  {
    sequelize,
    modelName: "Answer",
    tableName: "answers",
  }
);

export default Answer;