"""Tests for the Audient FastAPI backend."""

from __future__ import annotations

import pytest
from httpx import ASGITransport, AsyncClient

from main import app


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


async def test_root(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Audient API is running"
    assert "version" in data


async def test_health(client: AsyncClient):
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_list_items(client: AsyncClient):
    response = await client.get("/api/items")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) == 3


async def test_get_item_found(client: AsyncClient):
    response = await client.get("/api/items/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert "name" in data


async def test_get_item_not_found(client: AsyncClient):
    response = await client.get("/api/items/999")
    assert response.status_code == 404
    assert "detail" in response.json()
