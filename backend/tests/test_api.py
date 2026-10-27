
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app.main import app
from backend.app.database import get_db
from backend.app.base import Base
from backend.app import models


TEST_DATABASE_URL = "sqlite://"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    bind=test_engine,
    autoflush=False,
    autocommit=False,
)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def client():
    Base.metadata.create_all(bind=test_engine)

    with TestClient(app) as test_client:
        yield test_client

    Base.metadata.drop_all(bind=test_engine)


def test_health_check(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_task(client):
    response = client.post(
        "/tasks",
        json={
            "title": "Learn automated testing",
            "description": "Write API tests",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Learn automated testing"
    assert data["description"] == "Write API tests"
    assert data["is_completed"] is False
    assert "id" in data
    assert "created_at" in data


def test_list_tasks(client):
    client.post("/tasks", json={"title": "First task"})
    client.post("/tasks", json={"title": "Second task"})

    response = client.get("/tasks")

    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["title"] == "First task"
    assert response.json()[1]["title"] == "Second task"


def test_get_task(client):
    created = client.post(
        "/tasks",
        json={"title": "Find this task"},
    ).json()

    response = client.get(f"/tasks/{created['id']}")

    assert response.status_code == 200
    assert response.json()["title"] == "Find this task"


def test_get_missing_task_returns_404(client):
    response = client.get("/tasks/99999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_update_task(client):
    created = client.post(
        "/tasks",
        json={"title": "Old title"},
    ).json()

    response = client.put(
        f"/tasks/{created['id']}",
        json={
            "title": "Updated title",
            "description": "Updated description",
            "is_completed": True,
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated title"
    assert data["description"] == "Updated description"
    assert data["is_completed"] is True


def test_toggle_task_completion(client):
    created = client.post(
        "/tasks",
        json={"title": "Complete this task"},
    ).json()

    response = client.patch(
        f"/tasks/{created['id']}?is_completed=true"
    )

    assert response.status_code == 200
    assert response.json()["is_completed"] is True


def test_delete_task(client):
    created = client.post(
        "/tasks",
        json={"title": "Delete this task"},
    ).json()

    response = client.delete(f"/tasks/{created['id']}")

    assert response.status_code == 204
    assert client.get(f"/tasks/{created['id']}").status_code == 404


def test_create_task_rejects_empty_title(client):
    response = client.post(
        "/tasks",
        json={"title": ""},
    )

    assert response.status_code == 422


def test_update_missing_task_returns_404(client):
    response = client.put(
        "/tasks/99999",
        json={
            "title": "Updated task",
            "description": "This task does not exist",
            "is_completed": False,
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_delete_missing_task_returns_404(client):
    response = client.delete("/tasks/99999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_create_task_rejects_title_longer_than_200_characters(client):
    response = client.post(
        "/tasks",
        json={"title": "A" * 201},
    )

    assert response.status_code == 422


def test_create_task_rejects_description_longer_than_1000_characters(client):
    response = client.post(
        "/tasks",
        json={
            "title": "Valid title",
            "description": "A" * 1001,
        },
    )

    assert response.status_code == 422
