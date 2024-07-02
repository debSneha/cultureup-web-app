import request from 'supertest';
import createServer from '../../../utils/createServer';
import { Express } from 'express';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import {prisma} from '../../../utils/db.server';


const app: Express = createServer();


describe('register', () => {

    test('should respond with a 200 status code and user details', async () => {
        const { status, body } = await request(app).post('/api/user/register').send(
            {
                email: "test@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411054676",
                firebaseUid: uuidv4()
            }
        )
        expect(status).toBe(201);
        expect(body.username).toStrictEqual("testUser");
    });

    test('should respond with a 406 status code incase of duplicate email', async () => {

        await prisma.user.create({
            data: {
                email: "test@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411054674",
                firebaseUid: uuidv4()
            }
        })
        const { status, body } = await request(app).post('/api/user/register').send(
            {
                email: "test@gmail.com",
                username: "testUser2",
                userType: "USER",
                contact: "0411054674",
                firebaseUid: uuidv4()
            }
        )
        expect(status).toBe(406);
        expect(body).toStrictEqual("Email already in use");
    });

    test('should respond with a 406 status code incase of duplicate username', async () => {

        await prisma.user.create({
            data: {
                email: "test@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411054674",
                firebaseUid: uuidv4()
            }
        }) ;
        const { status, body } = await request(app).post('/api/user/register').send(
            {
                email: "test2@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411054674",
                firebaseUid: uuidv4()
            }
        )
        expect(status).toBe(406);
        expect(body).toStrictEqual("Username has been taken");
    });

    test('should respond with a 406 status code incase of invalid contact', async () => {

        const { status, body } = await request(app).post('/api/user/register').send(
            {
                email: "test@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411054",
                firebaseUid: uuidv4()
            }
        )
        expect(status).toBe(406);
        expect(body).toStrictEqual("Contact number not in format");
    })

});