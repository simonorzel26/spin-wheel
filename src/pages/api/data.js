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

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { remaining, removed } = req.body;
    const fileContents = readDataFile();

    fileContents.remaining = remaining.map((item) => ({
      ...item,
      style:{
        textColor: '#ffffff',
        backgroundColor: getColorByTitle(item.option),
      }
    }));
    fileContents.removed = removed.map((item) => ({
      ...item,
      style:{
        textColor: '#ffffff',
        backgroundColor: getColorByTitle(item.option),
      }
    }));

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
