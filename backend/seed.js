const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const generateRandomData = () => {
  const tables = [];
  const numberOfTables = Math.floor(Math.random() * 3) + 3; 

  for (let i = 0; i < numberOfTables; i++) {
    tables.push({
      id: uuidv4(),
      rows: Math.floor(Math.random() * 10) + 1,
      columns: Math.floor(Math.random() * 10) + 1,
      notes: `Sample note ${Math.random().toString(36).substring(7)}`,
      title: `Title ${Math.random().toString(36).substring(2, 9)}`,
    });
  }

  return tables;
};

const createJsonFiles = () => {
  for (let i = 1; i <= 5; i++) {
    const data = generateRandomData();
    const fileData = {
      id: i.toString(), // or use uuidv4() if you want a unique id
      tables: data,
    };
    fs.writeFileSync(`./src/files/file${i}.json`, JSON.stringify(fileData, null, 2));
  }
};

createJsonFiles();