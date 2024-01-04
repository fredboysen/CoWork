const { pool } = require('../index');
const bcrypt = require('bcrypt');


//select statement to retrieve user data for login
async function getUserByEmail(email) {
  const query = 'SELECT * FROM public.users WHERE email = $1';
  const values = [email];

  const result = await pool.query(query, values);
  return result.rows.length > 0 ? result.rows[0] : null;
}


//Insert new user in the database based on user input
async function createUser(email, hashedPassword, role, phone, name) {
    const query = 'INSERT INTO public.users (email, password, role, phone, name) VALUES ($1, $2, $3, $4, $5) RETURNING user_id';
    const values = [email, hashedPassword, role, phone, name];
  
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error executing createUser query', error);
      throw new Error('Internal Server Error');
    }
  };
  

  //select statement to display table data for joblisting page
  async function getJobListings() {
    const query = 'SELECT jobTitle, companyName, jobId, location, keySkills, jobDesc, pdfLink, to_char(created_at, \'YYYY-MM-DD\') as created_at FROM public.application';
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching job listings:', error);
      throw new Error('Internal Server Error');
    }
  }

//Insert data based on user input from job posting function in joblisting page
  async function postApplication(postedBy, jobTitle, companyName,  location, keySkills, jobDesc, pdfLink) {
    const query = 'INSERT INTO public.application (postedBy, jobTitle, companyName, location, keySkills, jobDesc, pdfLink, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE) returning jobId';
    const values = [postedBy, jobTitle, companyName, location, keySkills, jobDesc, pdfLink];
    
    
    
    try {
      const result = await pool.query(query, values);
      return { success: true, jobId: result.rows[0].jobId };
    } catch (error) {
      console.error('Error posting application', error);
      return { success: false, message: 'Error posting application' };
    }
  }


//exports
module.exports = {
  getUserByEmail,
  createUser,
  postApplication,
  getJobListings,
  
};

