import express from 'express';
import fs from 'fs';
import path from 'path';
import { ApiResponse } from '../app';

const router = express.Router();

export interface FileInfo {
  id: string;
  fileName: string;
}
export interface TableCell {
  column1?: string;
  column2?: string;
  column3?: string;
  column4?: string;
  column5?: string;
  column6?: string;
  column7?: string;
  column8?: string;
  column9?: string;
  column10?: string;
}

export interface TableInfo {
  id: string;
  rows: number;
  columns: number;
  notes: string;
  title: string;
}

export interface FileData {
  id: string;
  tables: TableInfo[];
}
router.get<{}, ApiResponse<FileInfo[]>>('/', (req, res) => {
  const filesDir = path.join(__dirname, '..', 'files');
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      console.log({ err });
      res.status(500).json({ error: 'Error reading files directory' });
    } else {
      const fileList: FileInfo[] = files.map((fileName, index) => ({
        id: (index + 1).toString(),
        fileName: fileName,
      }));
      res.json({ data: fileList });
    }
  });
});

router.get('/:id', (req, res) => {
  const filesDir = path.join(__dirname, '..', 'files');
  const fileId = req.params.id;
  const filePath = path.join(filesDir, `file${fileId}.json`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log({ err });
      res.status(404).json({ error: `File with ID ${fileId} not found` });
    } else {
      try {
        const fileData = JSON.parse(data);
        res.json({ data: fileData });
      } catch (parseErr) {
        console.log({ parseErr });
        res.status(500).json({ error: 'Error parsing file data' });
      }
    }
  });
});

router.get('/:fileId/tables/:tableId', (req, res) => {
  const { fileId, tableId } = req.params;
  const filePath = path.join(__dirname, '..', 'files', `file${fileId}.json`);

  fs.readFile(filePath, 'utf8', (err, fileContent) => {
    if (err) {
      console.log({ err });
      res.status(404).json({ error: `File with ID ${fileId} not found` });
    } else {
      try {
        const fileData: FileData = JSON.parse(fileContent);
        const table = fileData.tables.find(t => t.id === tableId);
        if (table) {
          const headers = Array.from({ length: table.columns }, (_, index) => `column${index + 1}`);
          const randomData = Array.from({ length: table.rows }, () =>
            headers.reduce((obj: TableCell, header) => {
              obj[header as keyof TableCell] = Math.random().toFixed(2);
              return obj;
            }, {} as TableCell),
          );
          res.json({ data: randomData });
        } else {
          res.status(404).json({ error: `Table with ID ${tableId} not found in file ${fileId}` });
        }
      } catch (parseErr) {
        console.log({ parseErr });
        res.status(500).json({ error: 'Error parsing file data' });
      }
    }
  });
});



export default router;
