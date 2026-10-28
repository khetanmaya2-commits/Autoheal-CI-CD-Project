
const { test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("./server");

test("GET / returns application details", async () => {
    const response = await request(app).get("/");

    assert.equal(response.status, 200);
    assert.equal(response.body.application, "AutoHeal CI/CD Platform");
    assert.equal(response.body.status, "running");
});

test("GET /health returns a healthy status", async () => {
    const response = await request(app).get("/health");

    assert.equal(response.status, 200);
    assert.equal(response.body.status, "healthy");
    assert.ok(response.body.timestamp);
});
