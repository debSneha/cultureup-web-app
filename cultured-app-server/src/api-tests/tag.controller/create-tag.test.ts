import request from 'supertest';
import createServer from '../../../utils/createServer';
import { Express } from 'express';
import { describe, test, expect, beforeAll } from 'vitest';
import admin from '../../config/firebase-config';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import {prisma} from '../../../utils/db.server';


const app: Express = createServer();


describe('create tag', () => {

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
                email: "admin@gmail.com",
                username: "admin",
                userType: "ADMIN",
                contact: "0411854678",
                firebaseUid: decoded.uid
            },
        })

        const { status, body } = await request(app).post('/api/tag/create').send({
            name: "anxiety",
        }).set({
            'Authorization': auth.body.idToken
        })

        expect(status).toBe(201);
    })

    test('should respond with a 500 status code incase of empty body', async () => {

        const { status, body } = await request(app).post('/api/tag/create').send({
        }).set({
            'Authorization': auth.body.idToken
        })

        expect(status).toBe(500);
    });

    test('should respond with a 400 status code if unauthorized', async () => {

        const { status, body } = await request(app).post('/api/tag/create').send({
            name: "anxiety",
        }).set({
            'Authorization': "ghdwwvghvhdwghv"
        })

        expect(status).toBe(400);
    });



});