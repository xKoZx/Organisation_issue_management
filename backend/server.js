const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crystal_ai_v2',
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});


const createChatbotTableQuery = `CREATE TABLE IF NOT EXISTS chatbot_v1 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  userinput VARCHAR(255) NOT NULL,
  chatbotreply VARCHAR(255) NOT NULL
)`;

db.query(createChatbotTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table chatbot_v1 created or already exists');
  }
});


const createAuthTableQuery = `CREATE TABLE IF NOT EXISTS auth (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
)`;

db.query(createAuthTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table auth created or already exists');
  }
});


const createIssueWindowTableQuery = `CREATE TABLE IF NOT EXISTS issue_window (
  issue_id INT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  imagename VARCHAR(255) NOT NULL
)`;


db.query(createIssueWindowTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table issue_window created or already exists');
  }
});

const createAdminTableQuery = `CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
)`;

db.query(createAdminTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table admin created or already exists');
  }
});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS livechatrequest (
      Issue_ID INT PRIMARY KEY,
      User_email VARCHAR(255),
      Staff_email VARCHAR(255),
      Report_Mode VARCHAR(255),
      Status VARCHAR(50)
    )
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table  livechatrequest created or already exist');
    }

    
  });

const createStaffTableQuery = `CREATE TABLE IF NOT EXISTS staffs (
  staff_id INT  PRIMARY KEY,
  staff_name VARCHAR(255) NOT NULL,
  staff_email VARCHAR(255) NOT NULL,
  staff_category VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
)`;

db.query(createStaffTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table staff created or already exists');
  }
});


const createIssueStatusTableQuery = `CREATE TABLE IF NOT EXISTS issue_status (
  issue_ID INT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  report_mode VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  assigned_staff VARCHAR(255),
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(255) NOT NULL,
  reply VARCHAR(255)
)`;


db.query(createIssueStatusTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table issue_status created or already exists');
  }
});



app.post('/issue', (req, res) => {
  const { issueID,email, category, message, imagePath } = req.body;

  
  

  
  const insertQuery = `INSERT INTO issue_window (issue_id, email, category, message, imagename) VALUES (?, ?, ?, ?, ?)`;
  db.query(insertQuery, [issueID, email, category, message, imagePath], (err, result) => {
    if (err) {
      console.error('Error inserting data into the table:', err);
      res.sendStatus(500);
      return;
    }
    console.log('Data inserted successfully');
    res.sendStatus(200);
  });
});


app.post('/liverequest', (req, res) => {
  const { issue_id, user_email, staff_email, report_mode, status } = req.body;

  
  const insertQuery = `INSERT INTO livechatrequest (Issue_ID, User_email, Staff_email, Report_Mode, Status) VALUES (?, ?, ?, ?, ?)`;
  db.query(insertQuery, [issue_id, user_email, staff_email, report_mode, status ], (err, result) => {
    if (err) {
      console.error('Error inserting data into the table:', err);
      res.sendStatus(500);
      return;
    }
    console.log('Data inserted successfully');
    res.sendStatus(200);
  });
});

app.get('/issue_inspect', (req, res) => {
  const query = 'SELECT * FROM issue_status WHERE category = "Chatbot"';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving issue status data:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }
    res.json(results);
  });
});



app.post('/issue_status', (req, res) => {
  const { issueID,email, report_mode,category,assigned_staff, date, time, status,staffreply } = req.body;

  // Insert the data into the "issue_window" table
  const insertQuery = `INSERT INTO issue_status (issue_id,email, report_mode, category, assigned_staff , date, time, status,reply ) VALUES (?, ?, ?, ?,?, ?, ?,?, ?)`;
  db.query(insertQuery, [issueID, email, report_mode,category,assigned_staff, date,time, status, staffreply], (err, result) => {
    if (err) {
      console.error('Error inserting data into the table:', err);
      res.sendStatus(500);
      return;
    }
    console.log('Data inserted successfully');
    res.sendStatus(200);
  });
});

app.post('/viewdetails', (req, res) => {
  const { issue_ID, mode } = req.body;
  console.log(mode);

  if (mode === 'Issue Window') {
    const query = 'SELECT category, message FROM issue_window WHERE issue_id = ?';

    db.query(query, [issue_ID], (err, results) => {
      if (err) {
        console.error('Error fetching issue window details:', err);
        res.status(500).json({ error: 'Failed to fetch issue window details.' });
      } else {
        if (results.length > 0) {
          const issueWindowData = results[0];
          res.status(200).json({ category: issueWindowData.category, message: issueWindowData.message });
        } else {
          res.status(404).json({ error: 'Issue window data not found.' });
        }
      }
    });
  } else {
    const query = 'SELECT * FROM chatbot_v1 WHERE id = ?';

    db.query(query, [issue_ID], (err, results) => {
      if (err) {
        console.error('Error fetching chatbot details:', err);
        res.status(500).json({ error: 'Failed to fetch chatbot details.' });
      } else {
        if (results.length > 0) {
          const chatbotData = results[0];
          res.status(200).json({ category: chatbotData.category, message: chatbotData.message });
        } else {
          res.status(404).json({ error: 'Chatbot data not found.' });
        }
      }
    });
  }
});

// app.post('/issue_view1', (req, res) => {
//   const { email, category } = req.body;

//   const query = 'SELECT * FROM issue_status WHERE assigned_staff = ?';
//   const categoryQuery = 'SELECT * FROM issue_status WHERE category = ?';

//   db.query(query, [email], (err, results) => {
//     if (err) {
//       console.error('Error fetching report status:', err);
//       res.status(500).json({ error: 'Failed to fetch report status.' });
//     } else if (results.length > 0) {
//       res.status(200).json(results);
//     } else {
//       db.query(categoryQuery, [category], (err, categoryResults) => {
//         if (err) {
//           console.error('Error fetching report status:', err);
//           res.status(500).json({ error: 'Failed to fetch report status.' });
//         } else {
//           res.status(200).json(categoryResults);
//         }
//       });
//     }
//   });
// });

app.post('/issue_view1', (req, res) => {
  const { email } = req.body;

  const query = 'SELECT * FROM issue_status WHERE assigned_staff = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.log("not found")
      console.error('Error fetching report status:', err);
      res.status(500).json({ error: 'Failed to fetch report status.' });
    } else {
      console.log("found")
      res.status(200).json(results);
    }
  });
});


app.post('/retrivewindowdata', (req, res) => {
  const { userEmail } = req.body;

  const query = 'SELECT * FROM issue_status WHERE assigned_staff = ? AND report_mode = "Issue Window"';

  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error('Error retrieving issue data:', err);
      res.status(500).json({ error: 'Failed to retrieve issue data.' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/retrivebotdata', (req, res) => {
  const { userEmail } = req.body;

  const query = 'SELECT * FROM issue_status WHERE assigned_staff = ? AND report_mode = "Chatbot"';

  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error('Error retrieving issue data:', err);
      res.status(500).json({ error: 'Failed to retrieve issue data.' });
    } else {
      res.status(200).json(results);
    }
  });
});






app.post('/getcategory', (req, res) => {
  const { email } = req.body;
  const query = 'SELECT staff_category FROM staffs WHERE staff_email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching user category: ', err);
      res.status(500).json({ error: 'Failed to fetch user category.' });
    } else {
      if (results.length > 0) {
        const { category } = results[0];
        res.status(200).json({ category });
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    }
  });
});


app.post('/statusupdate', (req, res) => {
  const { issue_ID, status, email,staffreply } = req.body;

  const updateQuery1 = `UPDATE issue_status SET status = '${status}', assigned_staff = '${email}', reply='${staffreply}' WHERE issue_ID = '${issue_ID}';`;
  const updateQuery2 = `UPDATE livechatrequest SET Status = '${status}' WHERE Issue_ID = '${issue_ID}';`;

  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      res.json({ success: false, message: 'Failed to update status' });
    } else {
      db.query(updateQuery1, (err, result1) => {
        if (err) {
          db.rollback(() => {
            console.error(err);
            res.json({ success: false, message: 'Failed to update status' });
          });
        } else {
          db.query(updateQuery2, (err, result2) => {
            if (err) {
              db.rollback(() => {
                console.error(err);
                res.json({ success: false, message: 'Failed to update status' });
              });
            } else {
              db.commit((err) => {
                if (err) {
                  db.rollback(() => {
                    console.error(err);
                    res.json({ success: false, message: 'Failed to update status' });
                  });
                } else {
                  res.json({ success: true, message: 'Status updated successfully' });
                }
              });
            }
          });
        }
      });
    }
  });
});


  
app.post('/staffcategory', (req, res) => {
  const { category } = req.body;

  const query = 'SELECT staff_email FROM staffs WHERE staff_category = ?';

  db.query(query, [category], (err, results) => {
    if (err) {
      console.error('Error retrieving staff members:', err);
      res.status(500).json({ error: 'Failed to retrieve staff members.' });
    } else {
      res.status(200).json(results);
    }
  });
});


app.post('/getchatwindow', (req, res) => {
  const { userEmail } = req.body;

 
  const query = `SELECT * FROM issue_status WHERE assigned_staff = ? AND category IN ('Chatbot', 'Live_Chat')`;
  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error('Error fetching issue records:', err);
      res.status(500).json({ error: 'Failed to fetch issue records' });
    } else {
      res.status(200).json(results);
    }
  });
});




app.post('/issue_view', (req, res) => {
  const { email } = req.body;
  const query = 'SELECT * FROM issue_status WHERE `email` = ?';
  console.log(email)
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching report status: ', err);
      res.status(500).json({ error: 'Failed to fetch report status.' });
    } else {
      res.status(200).json(results);
    }
  });
});


app.post('/issue_view_admin', (req, res) => {
  
  const query = 'SELECT * FROM issue_status';
 
  db.query(query,(err, results) => {
    if (err) {
      console.error('Error fetching report status: ', err);
      res.status(500).json({ error: 'Failed to fetch report status.' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/retrivewindow', (req, res) => {
  const { issueID } = req.body;
  console.log(issueID)
  
  const query = 'SELECT * FROM issue_window WHERE issue_id = ?';
  db.query(query, [issueID], (error, results) => {
    if (error) {
      console.error('Error retrieving window issue data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        const windowIssue = results[0];
        res.json(windowIssue);
      } else {
        res.status(404).json({ error: 'Window issue not found' });
      }
    }
  });
});

app.get('/issue_inspect1', (req, res) => {
  const category = req.query.category;
  const query = `SELECT * FROM issue_status WHERE report_mode = ?`;
  const values = [category];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error retrieving issue status data:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }
    
    res.json(results);
  });
});








app.post('/issue_view_staff', (req, res) => {
  const query = 'SELECT * FROM issue_status';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching report status: ', err);
      return res.status(500).json({ error: 'Failed to fetch report status.' });
    }

    res.status(200).json(results);
  });
});

app.post('/deletestaff', (req, res) => {
  const { email, password } = req.body;
  const query = 'DELETE FROM staffs WHERE `staff_email` = ? AND `password` = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error deleting staff:', err);
      res.status(500).json({ success: false });
    } else {
      if (results.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  });
});



const chatbot = {
  name: 'Chatbot',
  welcomeMessage: 'Hi! How can I assist you today?',
  previousUserMessage: '',
  previousBotMessage: '',
  getResponse: function (userMessage) {
    this.previousUserMessage = userMessage;

    let response;

   
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        response = 'Hello, I am Crystal AI! How can I help you?';
      } else if (userMessage.toLowerCase().includes('how are you')) {
        response = "I'm just a chatbot, but thanks for asking!";
      } else if (userMessage.toLowerCase().includes('thank you')) {
        response = "You're welcome!";
      }else if (userMessage.toLowerCase().includes('there is a problem in bathroom') || userMessage.toLowerCase().includes('i have a problem in bathroom')){
        response = "Is it?, Can you explain the problem";
       }
       else if (userMessage.toLowerCase().includes('water is not coming') &&  this.userResponse.toLowerCase().includes('i have a problem in bathroom')) {
        response = "maybe there is a problem in gatevalve. I'll report it to the admin and ping the status to you";
       }
       else if (userMessage.toLowerCase().includes('broken tap') &&  this.userResponse.toLowerCase().includes('i have a problem in bathroom')) {
        response = "Dont worry. I'll let the admin know and ping the status";
       }
       else if (userMessage.toLowerCase().includes('bulb is not working') &&  this.userResponse.toLowerCase().includes('i have a problem in bathroom')) {
        response = "Dont worry. I'll let the admin know and ping the status";
       }
       else if (userMessage.toLowerCase().includes('tap is broken') &&  this.userResponse.toLowerCase().includes('i have a problem in bathroom')) {
        response = "Dont worry. I'll let the admin know and ping the status";
       }
      /* else if (userMessage.toLowerCase().includes('water is not coming in tap') || userMessage.toLowerCase().includes('water is not coming')){
        response = "maybe there is a problem in gatevalve. I'll report it to the admin and ping the status to you";
       }*/
        else if (userMessage.toLowerCase().includes('water is not coming in the toilet' )&&  this.userResponse.toLowerCase().includes('i have a problem in bathroom')) {
        response = "maybe there is a problem in gatevalve. I'll report it to the admin and ping the status to you";
       } 
       else if (userMessage.toLowerCase().includes('power is not available')) {
        response = "Can you specifically describe in which area power is not available";
       }
       else if (userMessage.toLowerCase().includes('near canteen') &&  this.userResponse.toLowerCase().includes('power is not available')) {
        response = "maybe there might be some internal damage or power is not available elsewhere. I'll report it to the admin and ping the status to you";
       }
       else if (userMessage.toLowerCase().includes('near parking') &&  this.userResponse.toLowerCase().includes('power is not available')) {
        response = "maybe there might be some internal damage or power is not available elsewhere. I'll report it to the admin and ping the status to you";
       }
       else if (userMessage.toLowerCase().includes('projector is not working')) {
        response = "Can you specify the location where the projector is not working?";
       }
       else if (userMessage.toLowerCase().includes('in conference room') &&  this.userResponse.toLowerCase().includes('power is not available')) {
        response = "maybe there might be some internal damage or Cable miss allignment. I'll report it to the admin and ping the status to you";
       }
       else if (userMessage.toLowerCase().includes('in meeting room') &&  this.userResponse.toLowerCase().includes('power is not available')) {
        response = "maybe there might be some internal damage or Cable miss allignment. I'll report it to the admin and ping the status to you";
       }
       else if (userMessage.toLowerCase().includes('my system is not working') || userMessage.toLowerCase().includes('i have an issue with my system')) {
        response = "did you try restarting";
       }
       else if (userMessage.toLowerCase().includes('yes i tried restarting') &&  this.userResponse.toLowerCase().includes('my system is not working')) {
        response = "okay, can specify your location?";
       }
       else if (userMessage.toLowerCase().includes('yes i tried restarting') &&  this.userResponse.toLowerCase().includes('i have an issue with my system')) {
        response = "okay, can specify your location?";
       }
       else if (userMessage.toLowerCase().includes('in development center')  && this.userResponse.toLowerCase().includes('yes i tried restarting')) {
        response = "okay, i'll notify the admin and assign a technician to your location";
       }
       else if (userMessage.toLowerCase().includes('in testing center')  && this.userResponse.toLowerCase().includes('yes i tried restarting')) {
        response = "okay, i'll notify the admin and assign a technician to your location";
       }
       else if (userMessage.toLowerCase().includes('air conditioner is not working')) {
        response = "can you specify the location where air conditioner is not working";
       }
       else if (userMessage.toLowerCase().includes('in manager office') && this.userResponse.toLowerCase().includes('air conditioner is not working')) {
        response = "Dont worry!, i'll report this issue to the admin and rectify the issue";
       }
       else if (userMessage.toLowerCase().includes('in living area') && this.userResponse.toLowerCase().includes('air conditioner is not working')) {
        response = "Dont worry!, i'll report this issue to the admin and rectify the issue";
       }
       else if (userMessage.toLowerCase().includes('generator is not working')){
        response = "I think the fuel might be empty, i'll notify the admim about this issue.";

       }
       else if (userMessage.toLowerCase().includes('generator is not starting')){
        response = "I think the fuel might be empty, i'll notify the admim about this issue.";
        
       }
       else if (userMessage.toLowerCase().includes('i cant find my mobile') || userMessage.toLowerCase().includes('i cant find my laptop')) {
        response = "Where did you last see your device?";
       }
       else if (userMessage.toLowerCase().includes('in my working cabin') && this.userResponse.toLowerCase().includes('i cant find my mobile')) {
        response = "Dont worry!, i'll report this issue to the admin and help you find your device.";
       }
       else if (userMessage.toLowerCase().includes('in my working cabin') && this.userResponse.toLowerCase().includes('i cant find my laptop')) {
        response = "Dont worry!, i'll report this issue to the admin and help you find your device.";
       }
       else if (userMessage.toLowerCase().includes('wifi is not working') || userMessage.toLowerCase().includes('internet is not working')) {
        response = "Maybe there is a problem with the router. I'll report your problem to the admin and ping the status to you.";
       }else {
        response = "I'm sorry, I didn't understand that. Can you please rephrase?";
      }
      console.log("Previous /msg :------------------ ",this.userResponse)
      
      this.previousBotMessage = response;
      this.userResponse = userMessage;

    return response;
  },
};

app.post('/speak', (req, res) => {
  const { email, text, sender } = req.body.userMessage;

  
  const insertQuery = 'INSERT INTO chatbot_v1 (email, userinput, chatbotreply) VALUES (?, ?, ?)';
  const chatbotResponse = chatbot.getResponse(text);

  db.query(insertQuery, [email, text, chatbotResponse], (err, results) => {
    if (err) {
      console.error('Error inserting into table:', err);
      res.status(500).json({ message: 'Error inserting into table' });
    } else {
      console.log('Inserted into table:', results);
      res.status(200).json({ message: 'Inserted into table' });
    }
  });
});

app.post('/signup', (req, res) => {
  const sql = 'INSERT INTO auth (`name`, `email`, `password`) VALUES (?, ?, ?)';
  const values = [req.body.name, req.body.email, req.body.password];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error('Error inserting into signup table:', err);
      return res.json('Error');
    }
    return res.json(data);
  });
});

app.post('/login', (req, res) => {
  const sql = 'SELECT * FROM auth WHERE `email` = ?';
  const adminSql = 'SELECT * FROM admin WHERE `email` = ?';
  const staffSql = 'SELECT * FROM staffs WHERE `staff_email` = ?';

  db.query(sql, [req.body.email], (err, data) => {
    if (err) {
      console.error('Error retrieving from auth table:', err);
      return res.status(500).json({ status: 'Error' });
    }
    if (data.length > 0) {
      if (data[0].password !== req.body.password) {
        return res.status(401).json({ status: 'IncorrectPassword' });
      }
      return res.status(200).json({ status: 'Success', role: 'user' });
    } else {
  
      db.query(adminSql, [req.body.email], (err, adminData) => {
        if (err) {
          console.error('Error retrieving from admin table:', err);
          return res.status(500).json({ status: 'Error' });
        }
        if (adminData.length > 0) {
          if (adminData[0].password !== req.body.password) {
            return res.status(401).json({ status: 'IncorrectPassword' });
          }
          return res.status(200).json({ status: 'Success', role: 'admin' });
        } else {
          
          db.query(staffSql, [req.body.email], (err, staffData) => {
            if (err) {
              console.error('Error retrieving from staffs table:', err);
              return res.status(500).json({ status: 'Error' });
            }
            if (staffData.length > 0) {
              if (staffData[0].password !== req.body.password) {
                return res.status(401).json({ status: 'IncorrectPassword' });
              }
              return res.status(200).json({ status: 'Success', role: 'staff' });
            } else {
             
              return res.status(404).json({ status: 'Account not found' });
            }
          });
        }
      });
    }
  });
});




app.get('/users', (req, res) => {
  const query = 'SELECT * FROM auth';

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data from auth table:', error);
      res.status(500).json({ error: 'Error fetching data from auth table' });
      return;
    }

    res.json(results);
  });
});

app.get('/staffs', (req, res) => {
  const query = 'SELECT * FROM staffs';
  
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data from staff table:', error);
      res.status(500).json({ error: 'Error fetching data from staff table' });
      return;
    }
  
    res.json(results);
  });
});

app.get('/requestlive', (req, res) => {
  const { email} = req.query;
  const query = 'SELECT * FROM  livechatrequest WHERE `Staff_email`=?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching livechatrequest: ', err);
      res.status(500).json({ error: 'Failed to fetch livechatrequests.' });
    } else {
      console.log("Data Found")
      console.log(results);
      res.status(200).json(results);
    }
  });
});

  
  


app.post('/staffs', (req, res) => {
  const { staff_id,staffName,email, category, password } = req.body; // Updated variable name

  // Insert the new staff member into the "staffs" table
  const insertQuery = `INSERT INTO staffs (staff_id,staff_name,staff_email, staff_category, password) VALUES (?, ?, ?, ?, ?)`;
  db.query(insertQuery, [staff_id,staffName,email, category, password], (err, result) => { // Updated variable name
    if (err) {
      console.error('Error inserting data into the table:', err);
      res.sendStatus(500);
      return;
    }
    console.log('Staff added successfully');
    res.sendStatus(200);
  });
});
    

app.listen(8082, () => {
  console.log('Listening on port 8082');
});
