import request from 'supertest';
import createServer from '../../../utils/createServer';
import { Express } from 'express';
import { describe, test, expect, beforeAll } from 'vitest';
import {prisma} from '../../../utils/db.server';
import admin from '../../config/firebase-config';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';


const app: Express = createServer();


describe('update user', () => {

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
            'Authorization': auth.body.idToken
        })

        expect(status).toBe(201);
        expect(body.contact).toStrictEqual("0413858754");
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
            'Authorization': "hdjheftwyhdgshghewfgdaj"
        })

        expect(status).toBe(400);
    })

});