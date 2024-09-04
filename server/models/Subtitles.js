import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Subtitles',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      video_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.STRING, // 可考慮使用 `TIME` 或 `INTEGER` 格式以更精確地存儲時間
        allowNull: false,
      },
      end_time: {
        type: DataTypes.STRING, // 同上
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT, // `TEXT` 類型更適合存儲長文本
        allowNull: false,
      },
    },
    {
      tableName: 'subtitles', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
