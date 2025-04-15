import { z } from 'zod';

export const selectTodoSchema = z.object({
  id: z.string(),
  todo: z.string(),
  completed: z.boolean(),
  userId: z.string(),
});
export type Todo = z.infer<typeof selectTodoSchema>;

export const insertTodoSchema = selectTodoSchema.pick({
  todo: true,
  userId: true,
  completed: true,
});

export type TodoInsert = z.infer<typeof insertTodoSchema>;
