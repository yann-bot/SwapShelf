
import { faker } from "@faker-js/faker";
import Request from "supertest";
import app from "@/server";
import type { createUserInput } from "../users/core/users.models";

describe("Test books routes", ()=>{
    describe("Create book", ()=>{
        test("create book successfully", async()=>{
            const user: createUserInput = {
                name: faker.internet.username(),
                email: faker.internet.email(),
                password: 'motdepasse',
                role: 'client',
            };

            const createdUser = await Request(app).post('/users').send(user);
            expect(createdUser.status).toBe(201);

            const email = createdUser.body.user.email;
            const password = user.password;
            const tokenResponse = await Request(app).post('/auth/login').send({ email, password });
            expect(tokenResponse.status).toBe(200);
            const token = tokenResponse.body.token;

            const book = {
                title: faker.lorem.words(3),
                description: faker.lorem.sentence(),
                author: faker.person.fullName(),
                available: true,
                condition: "neuf" as const,
            };

            const createBookResponse = await Request(app)
                .post('/books')
                .set('Authorization', `Bearer ${token}`)
                .send(book);

            expect(createBookResponse.status).toBe(201);
            expect(createBookResponse.body.book).toBeDefined();
            expect(createBookResponse.body.book.title).toBe(book.title);
        })
    })
})