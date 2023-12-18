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

const filePath = path.join(process.cwd(), 'src', 'data', 'data.json');

function readDataFile() {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { remaining, removed } = req.body;
    const fileContents = readDataFile();

    fileContents.remaining = remaining;
    fileContents.removed = removed;

    fs.writeFileSync(filePath, JSON.stringify(fileContents));
    res.status(200).json(fileContents);
  } else if (req.method === 'GET') {
    const fileContents = readDataFile();
    res.status(200).json(fileContents);
  } else {
    // Method not allowed
    res.status(405).end();
  }
}
