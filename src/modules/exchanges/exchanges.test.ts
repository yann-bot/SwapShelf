import app from "@/server";
import { faker } from "@faker-js/faker";
import type { CreateExchangeInput } from "./core/exhanges.models";
import type { createUserInput } from "../users/core/users.models";
import  request from "supertest";





describe("Test exchanges routes", () =>{
    describe("create exhanges", () => {
        test("created exchange succefully", async() => {
            // Arrange: seed the requester user
           const user: createUserInput = {
                 name: faker.internet.username(),
                 email: faker.internet.email(),
                 password: 'password2003',
                 role: 'client'
           }

           const createdUser = await request(app).post('/users').send(user);
           expect(createdUser.status).toBe(201);
           
           // Simulate login to retrieve a bearer token for protected routes
           const email = createdUser.body.user.email;
           const password = user.password;
           const tokenResponse = await request(app).post('/auth/login').send({ email, password });
           expect(tokenResponse.status).toBe(200);

           const token = tokenResponse.body.token;
        
          // Requester publishes a book that will be offered in the exchange
          const myBookPayload = {
            title: faker.lorem.words(2),
            description: faker.lorem.sentence(),
            author: faker.person.fullName(),
            available: true,
            condition: "bon" as const,
          };

          const createdBookResponse = await request(app)
            .post("/books")
            .set("Authorization", `Bearer ${token}`)
            .send(myBookPayload);
          expect(createdBookResponse.status).toBe(201);
          const myBookId = createdBookResponse.body.book.id;

          // Create another user who owns the target book
          const owner: createUserInput = {
            name: faker.internet.displayName(),
            email: faker.internet.email(),
            password: "password2004",
            role: "client",
          };

          const createdOwner = await request(app).post("/users").send(owner);
          expect(createdOwner.status).toBe(201);

          const ownerLogin = await request(app)
            .post("/auth/login")
            .send({ email: owner.email, password: owner.password });
          expect(ownerLogin.status).toBe(200);
          const ownerToken = ownerLogin.body.token;

          // The owner publishes the book the requester wants
          const targetBookPayload = {
            title: faker.lorem.words(2),
            description: faker.lorem.sentence(),
            author: faker.person.fullName(),
            available: true,
            condition: "neuf" as const,
          };

          const createdTargetBook = await request(app)
            .post("/books")
            .set("Authorization", `Bearer ${ownerToken}`)
            .send(targetBookPayload);
          expect(createdTargetBook.status).toBe(201);
          const targetBookId = createdTargetBook.body.book.id;

          const exchange: CreateExchangeInput = {
            requester_id: createdUser.body.user.id,
            my_book_id: myBookId,
            target_book_id: targetBookId,
          };

          const createExchange = await request(app)
            .post("/exchanges")
            .set("Authorization", `Bearer ${token}`)
            .send(exchange);

          expect(createExchange.status).toBe(201);
          expect(createExchange.body.exchange).toBeDefined();
          expect(createExchange.body.exchange.requester_id).toBe(exchange.requester_id);
          expect(createExchange.body.exchange.my_book_id).toBe(myBookId);
          expect(createExchange.body.exchange.target_book_id).toBe(targetBookId);
        })
    })
})