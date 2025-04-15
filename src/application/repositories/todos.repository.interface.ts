import type { Todo, TodoInsert } from '@/src/entities/models/todo';

export interface ITodosRepository {
  createTodo(todo: TodoInsert, tx?: any): Promise<Todo>;
  getTodo(id: string): Promise<Todo | undefined>;
  getTodosForUser(userId: string): Promise<Todo[]>;
  updateTodo(id: string, input: Partial<TodoInsert>, tx?: any): Promise<Todo>;
  deleteTodo(id: string, tx?: any): Promise<void>;
}
