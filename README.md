# clean-architecture-nextjs

src/
├── application/
│   ├── repositories/
│   │   └── todos.repository.interface.ts       
│   ├── services/                                
│   └── use-cases/
│       └── todos/
│           └── create-todo.use-case.ts         
│
├── entities/
│   └── models/
│       └── todo.ts                             
│
├── infrastructure/
│   ├── repositories/
│   │   └── todos.repository.ts                 
│   └── services/                                
│
├── interface-adapters/
│   └── controllers/
│       └── todos/
│           └── create-todo.controller.ts        