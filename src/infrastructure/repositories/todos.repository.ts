import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';

import { TodoInsert, Todo } from '@/src/entities/models/todo';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import { DatabaseOperationError } from '@/src/entities/errors/common';
import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
  getFirestore,
  deleteDoc,
} from 'firebase/firestore';
import { db } from "@/lib/firebase/client-app";

export class TodosRepository implements ITodosRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) { }


  private collectionName = 'todos';

  async createTodo(todo: TodoInsert): Promise<Todo> {
    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > createTodo' },
      async () => {
        try {
          const docRef = await addDoc(collection(db, this.collectionName),
            {
              ...todo,
              updatedAt: new Date().toISOString()
            }
          );
          if (docRef) {
            const createdTodo: Todo = {
              ...todo,
              id: docRef.id
            };
            return createdTodo;
          } else {
            throw new DatabaseOperationError('Cannot create todo');
          }
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async getTodo(id: string): Promise<Todo | undefined> {

    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data()

    if (!docSnap.exists()) {
      return undefined; // TODO: convert to Entities error
    }
    if (!data) {
      throw new DatabaseOperationError('Cannot get todo');
    }
    return {
      id: docSnap.id,
      userId: data.userId as string,
      todo: data.todo as string,
      completed: data.completed as boolean
    } as Todo;

  }

  async getTodosForUser(userId: string): Promise<Todo[]> {
    return this.instrumentationService.startSpan(
      { name: 'TodosRepository > getTodosForUser' },
      async () => {
        try {
          let q = query(
            collection(db, this.collectionName),
            where("userId", "==", userId)
          );

          const results = await getDocs(q);

          if (results.empty) {
            return [];
          }
          const todos = results.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Todo));
          return todos;

        } catch (err) {
          this.crashReporterService.report(err);
          return [];
        }
      }
    );
  }


  async updateTodo(id: string, input: Partial<TodoInsert>, tx?: any): Promise<Todo> {
    return this.instrumentationService.startSpan(
      { name: 'TodosRepository > updateTodo' },
      async () => {
        try {
          const docRef = doc(db, this.collectionName, id);

          await updateDoc(docRef, {
            ...input,
            updatedAt: new Date().toISOString()
          });

          const updatedDoc = await getDoc(docRef);
          const updatedData = updatedDoc.data();

          if (!updatedData) {
            throw new DatabaseOperationError('Cannot fetch updated todo');
          }

          return {
            id: updatedDoc.id,
            userId: updatedData.userId as string,
            todo: updatedData.todo as string,
            completed: updatedData.completed as boolean,
          } as Todo;

        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
  async deleteTodo(id: string, tx?: any): Promise<void> {
    return this.instrumentationService.startSpan(
      { name: 'TodosRepository > deleteTodo' },
      async () => {
        try {
          const docRef = doc(db, this.collectionName, id);
          await deleteDoc(docRef);

        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
}
