import * as fs from 'fs/promises';
import { connection } from "../db_connection.js"

async function JsonOutput() {
    try {
      // Read the file asynchronously and specify 'utf8' as the encoding
      const data = await fs.readFile('./src/uploads/Ratings.json', 'utf8');
      
      // Parse the JSON data
      const jsonData = JSON.parse(data);
  
      // console.log(jsonData); // Log the parsed data
      return jsonData;
    } catch (err) {
  
      console.error('Error:', err);
    }
  }


const insertRating = async (movieName, rating, userID, date) => {
try {
    const query = `INSERT INTO ratings (movieName, rating, userID, date) VALUES (?, ?, ?, ?)`;
    const values = [movieName, rating, userID, date];
    
    await connection.execute(query, values);
    
    console.log(`Rating for ${movieName} inserted successfully.`);
} catch (error) {
    console.error(`Error inserting rating for ${movieName}:`, error);
}
};

export {JsonOutput, insertRating}