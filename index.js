const express = require('express');
const {db} = require('./DB')
const path = require("path")
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const app = express();
const port = process.env.PORT || 9000;
const Notes = require('./Router/Notes')
const {userSchema,loginSchema, otpSchema} = require('./middleware/schema');
const validate = require('./middleware/validate');
const {hashPassword,comparePassword, generateToken} = require('./utils/password')
const {sendMailToUser} = require('./utils/sendMail');
const {GenerateOTP} = require('./utils/Generate');

require('dotenv').config();


app.use(express.json());
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('/LoginToNotes', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
//   });
  
app.use(cors({
    origin: 'http://localhost:5173',  // or your actual frontend domain
    credentials: true                 // 👈 ALLOW cookies to be sent
  }));
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/notes", Notes);


// Middleware

app.post('/checkAuthValidUser', async(req, res) => {
    let token = req.cookies.token;
    if(!token){
        return  res.status(500).json({message : 'not a valid user'})
    }
   jwt.verify(token, process.env.JWT_SECRET,function(err, decoded) {
    if (err) throw err;
    return res.json({message : 'Welcome back',success : true, email : decoded.email})
})
    // console.log(decoded)
})

// Example API to get users
app.post('/sigIn', validate(userSchema), async(req, res) => {
    let { email, username, password} = req.body;
    email = email.toLowerCase();
    username = username.toLowerCase();
    const findquery = 'SELECT email FROM users WHERE email = ? OR username = ?';
    const hashedPassword = await hashPassword(password)

    db.query(findquery, [email,username], (error, result)=>{

        if(error){
            return res.status(500).json({message : 'something went wrong', error : err})
        }

        if(result.length > 0){
            return res.status(400).json({message : 'user already exist'})
        }

        const query = 'INSERT INTO users (username, email, password,otp) VALUES (?, ?, ?,?)';
        const otp = GenerateOTP(6)

        db.query(query, [username, email, hashedPassword,otp], (err, result) => {
            if (err) {
               return res.status(500).json({message : 'something went wrong', error : err})
            } else {
                sendMailToUser(res,otp,email,username,'otp')
            }
        });
    })
 
  
});

app.post('/Login', validate(loginSchema), async (req, res) => {
    const { email, password,remember } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    const isVerfied = 'SELECT isVerified FROM users WHERE email = ?'
    db.query(query, [email], async (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            // No user found with that email
            return res.status(401).json({ error: 'Invalid email or password' });
        }
          
        const user = result[0];

        db.query(isVerfied, [email], async (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if(result[0].isVerfied == 0){
                return res.status(400).json({ error: 'Not a Verfied user please Verfiy your self' });
            }


            const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
      
      const token = generateToken({ id: user.id, email: user.email,}, remember);

      res.cookie('token', token, {
        httpOnly: true,       
        secure: false,        
        sameSite: 'lax',      
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });

      res.status(200).json({ status: 'Logged in successfully' });


        })

        
    });
});

app.post('/verify',validate(otpSchema),(req,res)=>{
    const {otp,email} = req.body;

     const queryFindUser = 'SELECT * FROM users WHERE  otp = ? AND email = ?'
     const queryIsverified = 'SELECT isVerified FROM users WHERE email = ?'
     const queryUpdate = 'UPDATE users SET isVerified = ?';
     db.query(queryIsverified,[email], (error, result)=>{
        if(error){
            return res.status(500).json({message : 'something went wrong', error : error})
        }

        if(result[0] && result[0].isVerified  ==  1){
            return res.status(400).json({message : 'user already verified'})
        }

        db.query(queryFindUser,[otp,email], (error, result)=>{
            if(error){
                return res.status(500).json({message : 'something went wrong', error : err})
            }
       
            if(!result.length > 0){
                return res.status(500).json({message : 'wrong otp'})
                
            }
          const username = result[0].username;
            db.query(queryUpdate,[1], (error, result)=>{
                if(error){
                    return res.status(500).json({message : 'something went wrong', error : error})
                }
                 sendMailToUser(res,otp,email,username,'welcome')
            })

        })
     })
})
app.get('/logout', (req, res) => {
    res.clearCookie('token'); // 'token' should match the cookie name
    res.status(200).json({ success: true, message: 'Logged out' });
  });
// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
