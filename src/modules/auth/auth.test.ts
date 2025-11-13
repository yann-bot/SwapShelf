import { faker } from "@faker-js/faker"
import type { createUserInput } from "../users/core/users.models"
import  Request  from 'supertest';
import app from "@/server";





describe('Test auth routes', ()=>{

    test("Connected successfully", async()=> {
         const user: createUserInput={
                name: faker.internet.username(),
                email: faker.internet.email(),
                password: 'motdepasse',
                role: 'client',
         }

         const createdUser = await Request(app).post('/users').send(user);
         expect(createdUser.status).toBe(201);

         const email = createdUser.body.user.email
         const password = user.password
         const token = await Request(app).post('/auth/login').send({email, password});
         expect(token.status).toBe(200);
         expect(token.body.token).toBeDefined();
         
    })

    test("Failed: User not found", async()=> {
        const payload = {
             email: faker.internet.email(),
             password: faker.internet.password(),
        }
     
        const token = await Request(app).post('/auth/login').send(payload)
        expect(token.status).toBe(404);

    })

    test("Failed: Invalid credential", async()=> {
        const user: createUserInput={
            name: faker.internet.username(),
            email: faker.internet.email(),
            password: 'motdepasse',
            role: 'client',
     }

     const createdUser = await Request(app).post('/users').send(user);
     expect(createdUser.status).toBe(201);

     const email = createdUser.body.user.email
     const password = 'wrong_password'
     const token = await Request(app).post('/auth/login').send({email, password});
     expect(token.status).toBe(401);
    
    })


})