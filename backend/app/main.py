from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Task
from backend.app.schemas import TaskCreate, TaskResponse, TaskUpdate

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title = " TaskFlow API",
    description = "Backend API for the TaskFlow task and habit management application",
    version = "1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return{"message": "Welcome to TaskFlow API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post(
    "/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)

def create_task(
        task_data: TaskCreate,
        db: Session = Depends(get_db),
):
    task = Task(
        title=task_data.title,
        description=task_data.description,
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    return task

@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).order_by(Task.id).all()
    return tasks

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.get(Task, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )
    return task

@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task_completion(
        task_id:int, is_completed:bool, db: Session = Depends(get_db),
):
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )
    task.is_completed = is_completed
    db.commit()
    db.refresh(task)
    return task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
        task_id:int, task_data: TaskUpdate, db: Session = Depends(get_db),
):
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )
    task.title = task_data.title
    task.description = task_data.description
    task.is_completed = task_data.is_completed


    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
        task_id: int,
        db: Session = Depends(get_db),
):
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )
    db.delete(task)
    db.commit()