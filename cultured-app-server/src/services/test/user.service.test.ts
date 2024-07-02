import { createUser, listUsers, upsertEmergencyContact, updateUser } from "../user.service";
import { EmergencyContact, Role, User } from "@prisma/client";
import { expect, test, vi, describe } from 'vitest';
import prisma from "../../../utils/__mocks__/db.server";

vi.mock('../../../utils/db.server');

describe('createUser', () => {
    test('should create a user with valid credentials', async () => {
        const user: User = {
            id: 1,
            email: "test1@gmail.com",
            username: "test",
            userType: Role.USER,
            blocked: false,
            onboarded: false,
            contact: '0411054676',
            firebaseUid: 'e2e3c98f-8bbe-464e-9da4-655745311bb9'
        }

        prisma.user.create.mockResolvedValue(user);

        const newUser = await createUser(user);

        expect(newUser).toStrictEqual({
            id: 1,
            email: "test1@gmail.com",
            username: "test",
            userType: Role.USER,
            blocked: false,
            onboarded: false,
            contact: '0411054676',
            firebaseUid: 'e2e3c98f-8bbe-464e-9da4-655745311bb9'
        });
    });

    test('should fail incase of duplicate email', async () => {
        const user: User = {
            id: 2,
            email: "test1@gmail.com",
            username: "testuser",
            userType: Role.USER,
            blocked: false,
            onboarded: false,
            contact: '0411054676',
            firebaseUid: 'e2e3c98f-8bbe-464e-9da4-655745311bb9'
        }

        prisma.user.create.mockImplementation(() => {
            throw new Error('Email already in use')
        });

        await expect(createUser(user)).rejects.toThrowError('Email already in use')
    });

    test('should fail incase of duplicate username', async () => {
        const user: User = {
            id: 3,
            email: "test2@gmail.com",
            username: "testuser",
            userType: Role.USER,
            blocked: false,
            onboarded: false,
            contact: '0411054676',
            firebaseUid: 'e2e3c98f-8bbe-464e-9da4-655745311bb9'
        }

        prisma.user.create.mockImplementation(() => {
            throw new Error('Username has been taken')
        });

        await expect(createUser(user)).rejects.toThrowError('Username has been taken')
    });

    test('should fail incase of wrong contact format', async () => {
        const user: User = {
            id: 4,
            email: "test4@gmail.com",
            username: "testuser4",
            userType: Role.USER,
            blocked: false,
            onboarded: false,
            contact: '041105',
            firebaseUid: 'e2e3c98f-8bbe-464e-9da4-655745311bb9'
        }

        prisma.user.create.mockImplementation(() => {
            throw new Error('Contact number not in format')
        });

        await expect(createUser(user)).rejects.toThrowError('Contact number not in format')
    });
});

describe('createEmergencyContact', () => {

    test('should create emergency contact', async () =>  {
        const contact:EmergencyContact = {
            id: 1,
            name: "test",
            phoneNumber: "0410856786",
            userId: 1
        }

        const uid = 'e2e3c98f-8bbe-464e-9da4-655745311bb9';

        prisma.user.findFirstOrThrow.mockResolvedValue({
            id: 1,
            email: "",
            username: "",
            userType: "USER",
            blocked: false,
            onboarded: false,
            firebaseUid: "",
            contact: ""
        });
        prisma.emergencyContact.upsert.mockResolvedValue(contact);

        const emergencyContact = await upsertEmergencyContact(contact, uid);

        expect(emergencyContact).toStrictEqual(contact);
    });
});

describe('listUser', () => {

    test('should list all users', async () =>  {
        const users: User[] = [{
            id: 1,
            email: "test1@gmail.com",
            username: "test",
            userType: Role.USER,
            blocked: false,
            onboarded: false,
            contact: '0411054676',
            firebaseUid: 'e2e3c98f-8bbe-464e-9da4-655745311bb9'

        }, {
            id: 2,
            email: "test2@gmail.com",
            username: "test2",
            userType: Role.USER,
            blocked: false,
            onboarded: false,
            contact: '0411054676',
            firebaseUid: 'e2e3c98f-8bbe-464e-9da4-655745311bb7'
        }];

        prisma.user.findMany.mockResolvedValue(users);

        const list = await listUsers();

        expect(list).toStrictEqual(users);
    })
});

describe('updateUser', () => {

    test('should update an user', async() => {
        const user = {
            id: 1,
            email: "test1@gmail.com",
            username: "test",
            userType: Role.USER,
            blocked: false,
            onboarded: false,
            contact: '0411054567',
            firebaseUid: 'e2e3c98f-8bbe-464e-9da4-655745311bb9'
        };

        const uid = 'e2e3c98f-8bbe-464e-9da4-655745311bb9';

        prisma.user.update.mockResolvedValue(user);

        const updatedUser = await updateUser(user, uid);

        expect(updatedUser).toStrictEqual(user);
    });
    
})







