import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const fileName = Array.isArray(slug) ? slug.join('/') : slug;
  
  try {
    const filePath = path.join(process.cwd(), 'public', `${fileName}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(fileContent);
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
}