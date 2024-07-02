import request from 'supertest';
import createServer from '../../../utils/createServer';
import { Express } from 'express';
import { describe, test, expect, beforeAll } from 'vitest';
import {prisma} from '../../../utils/db.server';
import admin from '../../config/firebase-config';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { v4 as uuidv4 } from 'uuid';


const app: Express = createServer();


describe('get all users', () => {

    let auth: any;
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
        decoded = await admin.auth().verifyIdToken(auth.body.idToken);
    });

    test('should respond with a 200 status code', async () => {

        await prisma.user.createMany({
            data: [{
                email: "test@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411854678",
                firebaseUid: decoded.uid
            },
            {
                email: "test2@gmail.com",
                username: "testUser2",
                userType: "USER",
                contact: "0411854978",
                firebaseUid: uuidv4()
            },
            {
                email: "test3@gmail.com",
                username: "testUser3",
                userType: "USER",
                contact: "0411854698",
                firebaseUid: uuidv4()
            }
            ]
        });

        const { status, body } = await request(app).get('/api/user/get').set({
            'Authorization': auth.body.idToken
        })

        expect(status).toBe(200);
    });

    test('should respond with a 400 status code incase of incorrect uid', async () => {

        await prisma.user.create({
            data: {
                email: "test@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411854678",
                firebaseUid: decoded.uid
            }
        });

        const { status, body } = await request(app).put('/api/user/update').send({

            contact: "0413858754"
        }).set({
            'Authorization': uuidv4()
        })

        expect(status).toBe(400);
    })

});