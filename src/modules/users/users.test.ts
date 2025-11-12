import type {  createUserInput} from "./core/users.models";
import app from '@/server';
import { faker } from '@faker-js/faker';
import request from "supertest";
import { repo } from "./index";







describe("Test User routes", async()=>{

   describe("Test user creation", async() => {
      test("User created successfully", async()=> {
            const input:createUserInput = {
               name: faker.internet.username(),
               email: faker.internet.email(),
               password: faker.internet.password(),
               role: 'client',
            }

            const result = await request(app).post('/users').send(input)
            expect(result.status).toBe(201);
            expect(result.body.message).toEqual("User created");
           
      }),

      test("Failed:because of invalid data", async()=> {
            const invalidInput = {
               name: '',
               email: faker.string.sample(8),
               password: 'short',
               role: 'client'
            };

            const result = await request(app).post('/users').send(invalidInput);

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty('error');
            expect(result.body.error).toContain('name');
      })

     test("Failed: because user already exist", async()=> {
           const duplicateEmail = faker.internet.email();
           const firstInput:createUserInput = {
             name: faker.internet.username(),
             email: duplicateEmail,
             password: faker.internet.password(),
             role: 'client',
           };

           const secondInput:createUserInput = {
             name: faker.internet.username(),
             email: duplicateEmail,
             password: faker.internet.password(),
             role: 'client',
           };

           const firstResult = await request(app).post('/users').send(firstInput);
           expect(firstResult.status).toBe(201);

           const secondResult = await request(app).post('/users').send(secondInput);
           expect(secondResult.status).toBe(409);
           expect(secondResult.body).toHaveProperty('error');
           expect(secondResult.body.error).toContain('already exists');
     })

     test("Failed: because of an Infrastructure erro occur", async()=> {
           const input:createUserInput = {
             name: faker.internet.username(),
             email: faker.internet.email(),
             password: faker.internet.password(),
             role: 'client'
           };

           const createSpy = jest
             .spyOn(repo, 'create')
             .mockRejectedValueOnce(new Error('Database connection lost'));

           const result = await request(app).post('/users').send(input);

           expect(createSpy).toHaveBeenCalled();
           expect(result.status).toBe(500);
           expect(result.body).toHaveProperty('error');
           expect(result.body.error).toContain('Infra failure while creating user');
           createSpy.mockRestore();
     })
   })

    describe("test readOne user", async() => {
       test("User read successfully", async() => {
          const input:createUserInput = {
            name: faker.internet.username(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'client'
          };

          const creation = await request(app).post('/users').send(input);
          expect(creation.status).toBe(201);

          const read = await request(app).get(`/users/${input.email}`);

          expect(read.status).toBe(200);
          expect(read.body).toHaveProperty('user');
          expect(read.body.user.email).toBe(input.email);
      })

       test("Failed: User not found", async()=>{
          const email = faker.internet.email();
          const response = await request(app).get(`/users/${email}`);

          expect(response.status).toBe(404);
          expect(response.body).toHaveProperty('error');
          expect(response.body.error).toContain('not found');
      })

       test("Failed: Infra error", async()=> {
          const email = faker.internet.email();

          const readSpy = jest
            .spyOn(repo, 'readOneEmail')
            .mockRejectedValueOnce(new Error('Database offline'));

          const response = await request(app).get(`/users/${email}`);

          expect(readSpy).toHaveBeenCalledWith(email);
          expect(response.status).toBe(500);
          expect(response.body).toHaveProperty('error');

          readSpy.mockRestore();
      })
      
   } )

})