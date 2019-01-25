/*
  Credits
  -------
  A big thanks to my friends 'Gracian' and 'Dr. Copain' for helping me with this script
  -------
*/

import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('Connected to PSQL db');
});


// Create Tables
const createTables = () => {
  const queryUsers =
    `CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      firstname varchar (50) NOT NULL,
      lastname varchar (50) NOT NULL,
      othername varchar (50) NOT NULL,
      email varchar (80) UNIQUE NOT NULL,
      phoneNumber varchar (15) UNIQUE NOT NULL,
      username varchar (30) NOT NULL,
      password varchar NOT NULL,
      registered timestamptz,
      isAdmin boolean DEFAULT FALSE
    );`;
  const queryMeetups =
    `CREATE TABLE IF NOT EXISTS meetups (
      id serial PRIMARY KEY,
      createdOn timestamptz,
      location varchar (150) NOT NULL,
      images text [] NULL,
      topic varchar (150) NOT NULL,
      happeningOn timestamptz,
      tags text [] NULL,
      createdby int REFERENCES users ON DELETE CASCADE);`;
  const queryQuestions =
    `CREATE TABLE IF NOT EXISTS questions (
      id serial PRIMARY KEY,
      createdOn timestamptz,
      createdBy int REFERENCES users ON DELETE CASCADE,
      meetup int REFERENCES meetups ON DELETE CASCADE,
      title varchar (30) NOT NULL,
      body varchar (30) NOT NULL,
      upvotes int NOT NULL,
      downvotes int NOT NULL
    );`;
  const queryComments =
    `CREATE TABLE IF NOT EXISTS comments (
      id serial PRIMARY KEY,
      commentedOn timestamptz,
      question int REFERENCES questions ON DELETE CASCADE,
      body varchar (100) NOT NULL,
      commentedBy int REFERENCES users ON DELETE CASCADE
    );`;
  const queryReplies =
    `CREATE TABLE IF NOT EXISTS replies (
      id serial PRIMARY KEY,
      repliedOn timestamptz,
      comment int REFERENCES comments ON DELETE CASCADE,
      body varchar (100) NOT NULL,
      commentedBy int REFERENCES users ON DELETE CASCADE
    );`;
  const queryRsvps =
    `CREATE TABLE IF NOT EXISTS rsvps (
      id integer NOT NULL,
      meetup int REFERENCES meetups ON DELETE CASCADE,
      userId int REFERENCES users ON DELETE CASCADE,
      response varchar (5) NOT NULL,
      PRIMARY KEY (meetup, userId)
    );`;

  const con = `
    ${queryUsers}; 
    ${queryMeetups}; 
    ${queryQuestions}; 
    ${queryComments}; 
    ${queryReplies}; 
    ${queryRsvps};
  `;
  
  pool.query(con)
    .then((res) => {
      console.log('...', res);
      pool.end();
    })
    .catch((err) => {
      console.log('+++ ', err);
      pool.end();
    });

  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};

export { createTables };

require('make-runnable');
