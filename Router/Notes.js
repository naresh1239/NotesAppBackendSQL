// routes/userRoutes.js
const fs = require('fs');
const path = require('path');
const {db} = require('../DB')
const cookieParser = require('cookie-parser')
const express = require("express");
const router = express.Router();
const {GenerateID} = require('../utils/Generate')
const {authMiddleware} = require("../utils/password")
const cors = require('cors');
// Route: GET /users

router.use(cookieParser());

router.use(cors({
    origin: ['http://localhost:5173','https://sqlnotes.netlify.app'],  // or your actual frontend domain
    credentials: true                 // 👈 ALLOW cookies to be sent
  }));

router.get("/readNotes",authMiddleware, (req, res) => {
     const {id, userId} = req.query; 
    function getJsonData(filePath, callback) {
        fs.readFile(filePath, 'utf-8', (err, data) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, JSON.parse(data)); 
          }
        });
      }
    db.query('SELECT * FROM notes WHERE notes_id = ? And User_id = ?',[id,userId],(err,result)=>{
        if (err) return res.status(500).json({ error: err.message });
        if(!result[0]) return res.status(500).json({ message : "data not found" });
       getJsonData(result[0].notesHTML,(err,jsonData)=>{
        if (err) return res.status(500).json({ error: err.message });
         delete result[0].notesHTML
        res.send({data : {jsonData, data : result[0]}})
       })
    })
});


router.get("/readPublicNotes", (req, res) => {
  const {id} = req.query; 
 function getJsonData(filePath, callback) {
     fs.readFile(filePath, 'utf-8', (err, data) => {
       if (err) {
         callback(err, null);
       } else {
         callback(null, JSON.parse(data)); 
       }
     });
   }
 db.query('SELECT * FROM notes WHERE notes_id = ? And is_public = 1',[id],(err,result)=>{
     if (err) return res.status(500).json({ error: err.message });
     if(!result[0]) return res.status(500).json({ message : "data not found" });
    getJsonData(result[0].notesHTML,(err,jsonData)=>{
     if (err) return res.status(500).json({ error: err.message });
      delete result[0].notesHTML
     res.send({data : {jsonData, data : result[0]}})
    })
 })
});



router.post("/Navlinks", authMiddleware,(req, res) => {
  const {id} = req.body
    const query = 'SELECT * FROM notes WHERE User_id = ? ORDER BY create_at DESC'; 
    db.query(query,[id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); 
    });
});

router.post("/CreateNotes", authMiddleware,(req, res) => {
    const { notesHTML , title ,des,isPublic,userData} = req.body; // Get the notesHTML from the request body

    // Create a unique file name based on the current timestamp
    const fileName = `document_${Date.now()}.json`; // Unique file name
    const filePath = path.join(__dirname, 'documents', fileName); // Path to save the file
  
    // Create the 'documents' directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'documents'))) {
      fs.mkdirSync(path.join(__dirname, 'documents'));
    }
  
    // Save the notesHTML content to a JSON file
    const fileContent = {
      content: notesHTML
    };
  
    fs.writeFile(filePath, JSON.stringify(fileContent, null, 2), (err) => {
      if (err) {
        console.error('Error saving file:', err);
        return res.status(500).json({ status: 'Error saving file' });
      }
  
      // Insert the file path into the database instead of the HTML content
      const query = 'INSERT INTO notes (notes_id, notesHTML,title, des,is_public,User_id) VALUES (?, ?,?,?,?,?)';
     const id = GenerateID(15)
      db.query(query, [id, filePath, title,des,isPublic,userData], (err, result) => {
        if (err) {
          console.error('Error inserting note into database:', err);
          return res.status(500).json({ status: 'Error inserting note into database' });
        } else {
          console.log('Note saved to database:');
          res.json({ status: 'Note saved successfully', id: id });
        }
      });
    });
  });
// Route: POST /users     

router.post("/EditNotes",authMiddleware, (req, res) => {
    const {id,notesHTML,title,des,isPublic} = req.body

    const fileContent = {
        content: notesHTML
      };

    db.query('SELECT * FROM notes WHERE notes_id = ?',[id],(err,result)=>{
        if (err) return res.status(500).json({ error: err.message });
        if(!result[0]) return res.status(500).json({ message : "data not found" });

        fs.writeFile(result[0].notesHTML, JSON.stringify(fileContent, null, 2), (err) => {
            if (err) {
              console.error('Error saving file:', err);
              return res.status(500).json({ status: 'Error saving file1' });
            }else{
                const query = 'UPDATE notes SET title = ?, des = ? WHERE notes_id = ?';
                db.query(query,[title,des,id],(error,result)=>{
                   if(error) return res.status(500).json({ status: 'Error saving file2' });
                    return res.status(200).json({ status: 'File update sucessfully', id: id });
                })
                
            }
        })
    })

});

router.delete('/DeleteNote',authMiddleware, (req, res) => {

  const id = req.query.id;

  if (!id) return res.status(400).json({ message: "ID is required" });

  db.query('SELECT * FROM notes WHERE notes_id = ?', [id], (err, result) => {

      if (err) return res.status(500).json({ error: err.message });
      if (!result[0]) return res.status(400).json({ message: "Note not found" });

      db.query('DELETE FROM notes WHERE notes_id = ?', [id], (error, dbResult) => {
        if (error) {
            console.error('Error deleting from DB:', error.message);
            return res.status(500).json({ status: 'Error deleting note from database' });
        }
    
        
        res.status(200).json({ status: 'Note deleted successfully' });
    
        
        if (path && typeof path === 'object' && path.path) {
          path = path.path; // extract the actual string
      }
      
      if (typeof path === 'string') {
          fs.unlink(path, (err) => {
              if (err) {
                  console.warn('File deletion failed (not critical):', err.message);
              } else {
                  console.log(`File deleted: ${path}`);
              }
          });
      } else {
          console.warn('notesHTML path is undefined or invalid:', path);
      }
    });

  });
});


module.exports = router;
