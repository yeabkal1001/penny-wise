import { sql } from "../config/db.js";

export async function getGoalsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const goals = await sql`
      SELECT * FROM goals WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(goals);
  } catch (error) {
    console.log("Error getting goals", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createGoal(req, res) {
  try {
    const { user_id, name, target_amount, current_amount, icon } = req.body;

    if (!user_id || !name || target_amount === undefined) {
      return res.status(400).json({ message: "user_id, name, target_amount are required" });
    }

    const goal = await sql`
      INSERT INTO goals(user_id, name, target_amount, current_amount, icon)
      VALUES (${user_id}, ${name}, ${target_amount}, ${current_amount || 0}, ${icon || "trophy"})
      RETURNING *
    `;

    res.status(201).json(goal[0]);
  } catch (error) {
    console.log("Error creating goal", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateGoal(req, res) {
  try {
    const { id } = req.params;
    const { user_id, target_amount, current_amount, icon } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const result = await sql`
      UPDATE goals
      SET target_amount = COALESCE(${target_amount}, target_amount),
          current_amount = COALESCE(${current_amount}, current_amount),
          icon = COALESCE(${icon}, icon)
      WHERE id = ${id} AND user_id = ${user_id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.log("Error updating goal", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteGoal(req, res) {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const result = await sql`
      DELETE FROM goals WHERE id = ${id} AND user_id = ${user_id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.log("Error deleting goal", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
