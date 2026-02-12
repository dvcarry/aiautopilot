import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/db";

export interface ReplicaAttributes {
  id?: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Replica extends Model<ReplicaAttributes> implements ReplicaAttributes {
  public id!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Replica.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Replica",
    tableName: "replicas",
  }
);

export default Replica;