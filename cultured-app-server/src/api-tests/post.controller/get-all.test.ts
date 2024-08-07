import request from 'supertest';
import createServer from '../../../utils/createServer';
import { Express } from 'express';
import { describe, test, expect, beforeAll } from 'vitest';
import {prisma} from '../../../utils/db.server';
import admin from '../../config/firebase-config';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';


const app: Express = createServer();


describe('posts fetch', () => {

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
                firebaseUid: decoded.uid,
                id: 1
            }
        });

        await prisma.post.createMany({
            data: [{
                title: "title",
                author: "author",
                desc: "desc",
                userId: 1
            },
            {
                title: "title2",
                author: "author2",
                desc: "desc",
                userId: 1
            }]
        });

        const { status, body } = await request(app).get('/api/post/get-all')
        .set({
            'Authorization': auth.body.idToken
        })

        expect(status).toBe(200);
        expect(body[0].title).toStrictEqual("title");
        expect(body[1].title).toStrictEqual("title2");
    });

    test('should respond with a 400 status code if not authorised', async () => {


        const { status, body } = await request(app).get('/api/post/get-all').send({
            title: "title",
            author: "author"
       }).set({
            'Authorization': "gfcvbhgfcgvhngfgdg"
       })

        expect(status).toBe(400);
        
    });


});