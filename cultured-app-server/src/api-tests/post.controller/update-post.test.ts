import request from 'supertest';
import createServer from '../../../utils/createServer';
import { Express } from 'express';
import { describe, test, expect, beforeAll } from 'vitest';
import {prisma} from '../../../utils/db.server';
import admin from '../../config/firebase-config';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

const app: Express = createServer();

describe('update post', () => {

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

    test('should respond update the post status', async () => {

        await prisma.user.create({
            data: {
                email: "test@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411854678",
                firebaseUid: decoded.uid,
                id: 1
            }
        });

        await prisma.post.create({
            data: {
                title: "Post Title 1",
                author: "author",
                desc: "desc",
                userId: 1,
                id: 1,
                status: 'APPROVED'
            }
        })

        const { status, body } = await request(app).put('/api/post/update-post').send({
            status: 'REJECTED', id: 1
        }).set({
            'Authorization': auth.body.idToken
        })

        expect(status).toBe(201);
        expect(body.status).toStrictEqual("REJECTED");
    });

    test('should respond with a 400 status code incase of incorrect uid', async () => {

        await prisma.user.create({
            data: {
                email: "test@gmail.com",
                username: "testUser",
                userType: "USER",
                contact: "0411854678",
                firebaseUid: decoded.uid,
                id: 1
            }
        });

        await prisma.post.create({
            data: {
                title: "Post Title 1",
                author: "author",
                desc: "desc",
                userId: 1,
                id: 1,
                status: 'APPROVED'
            }
        })

        const { status, body } = await request(app).put('/api/post/update-post').send({
             status: 'REJECTED', id: 1
        }).set({
            'Authorization': "hdjheftwyhdgshghewfgdaj"
        })

        expect(status).toBe(400);
    })

})