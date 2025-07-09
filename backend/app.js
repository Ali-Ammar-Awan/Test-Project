require('dotenv').config();
const express = require('express');
const cors = require ('cors');
const app = express();
const { sequelize } = require('./models'); 
const routes = require('./routes');


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/', routes);


const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established.');
    return sequelize.sync({alter:true}); 
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
