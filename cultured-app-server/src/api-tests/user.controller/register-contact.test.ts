import request from 'supertest';
import createServer from '../../../utils/createServer';
import { Express } from 'express';
import { describe, test, expect, beforeAll } from 'vitest';
import {prisma} from '../../../utils/db.server';
import admin from '../../config/firebase-config';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';


const app: Express = createServer();


describe('register-contact', () => {

    let auth:any;
    let decoded: DecodedIdToken;

    beforeAll(async () => {

        auth = await request('https://www.googleapis.com/identitytoolkit/v3/relyingparty')
            .post(`/verifyPassword?key=${process.env.KEY}`).send(
                {
                    email: process.env.EMAIL,
                    password: process.env.PASSWORD,
                    returnSecureToken: true
                }
            );
        decoded  = await admin.auth().verifyIdToken(auth.body.idToken);
    });

    test('should respond with a 200 status code',async () => {

        await prisma.user.create({
            data: {
                email: "test@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411854678",
                firebaseUid: decoded.uid
            }
        }); 

       const {status, body} = await request(app).post('/api/user/register-contact').send({
            name: "test1",
            phoneNumber: "0410856754"
       }).set({
            'Authorization': auth.body.idToken
       })

       expect(status).toBe(201);
    })

    test('should respond with a 401 status code if not authorized',async () => {

        await prisma.user.create({
            data: {
                email: "test@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411854678",
                firebaseUid: decoded.uid
            }
        }); 

       const {status, body} = await request(app).post('/api/user/register-contact').send({
            name: "test1",
            phoneNumber: "0410856754"
       })

       expect(status).toBe(401);
    });

    test('should respond with a 406 status code incase of invalid phoneNumber',async () => {

        await prisma.user.create({
            data: {
                email: "test@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411854678",
                firebaseUid: decoded.uid
            }
        }); 

       const {status, body} = await request(app).post('/api/user/register-contact').send({
            name: "test1",
            phoneNumber: "04108567578898774"
       }).set({
            'Authorization': auth.body.idToken
        })

       expect(status).toBe(406);
       expect(body).toStrictEqual("Contact number not in format")
    })
    
});