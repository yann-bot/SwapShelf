import app from "@/server";
import { faker } from "@faker-js/faker";
import type { CreateExchangeInput } from "./core/exhanges.models";
import type { createUserInput } from "../users/core/users.models";
import  request from "supertest";





describe("Test exchanges routes", () =>{
    describe("create exhanges", () => {
        test("created exchange succefully", async() => {
           const user: createUserInput = {
                 name: faker.internet.username(),
                 email: faker.internet.email(),
                 password: 'password2003',
                 role: 'client'
           }

           const createdUser = await request(app).post('/users').send(user);
           expect(createdUser.status).toBe(201);
           
           const email = createdUser.body.user.email;
           const password = user.password;
           const tokenResponse = await request(app).post('/auth/login').send({ email, password });
           expect(tokenResponse.status).toBe(200);

           const token = tokenResponse.body.token;
           
        })
    })
})