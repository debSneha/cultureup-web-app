## Culture Up APP 

#### ABOUT

The culture up app is a responsive web app that acts as a one-stop-shop for all things related to
psychoeducation, allowing users to read articles, participate in workshops and
courses, and book counseling sessions with therapists.

### TECHNOLOGIES USED

- React - frontend framework 
- Express - backend framework
- Postgres - database
- Tailwind - css framework
- Firebase - authentication
- Prisma ORM - database managemnet

#### DEVELOPEMENT GUIDE

To start the frontend locally:

```
cd cultured-app-client
npm install
npm run build
npm run dev
```

To start the backend locally:

1. Setup database

To connect to a database the DATABASE_URL in the .env file needs to be changed to the db url running in your local. 

to migrate to your database run the following commands
```
prisma migrate dev
npx prisma db seed
```

For convenience the database is seeded with default admin user, the details of which is in the environment file. 

2. Run server
```
cd cultured-app-server
npm install
npm build
npm run dev
```
