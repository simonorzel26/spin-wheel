/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// pages/api/updateData.js
// pages/api/updateData.js
import fs from 'fs';
import path from 'path';
import clientPromise from '../../lib/mongodb';
const filePath = path.join(process.cwd(), 'src', 'data', 'data.json');

function readDataFile() {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}


const colors = [
  '#0d1321ff',
  '#1d2d44ff',
  '#3e5c76ff',
  '#748cabff',
];

function getColorByTitle(title) {
  // Calculate a hash code for the title
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
  }

  // Ensure the hash is positive and within the array bounds
  const index = Math.abs(hash) % colors.length;

  // Return the color associated with the index
  return colors[index];
}

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("db"); // Replace with your database name

  if (req.method === 'GET') {
    const data = await db.collection("collection").findOne({});
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { remaining, removed } = req.body;
    await db.collection("collection").updateOne({}, { $set: { remaining, removed } }, { upsert: true });
    res.status(200).json({ remaining, removed });
  } else {
    res.status(405).end();
  }
}
