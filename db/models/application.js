const { pool } = require('../index');

async function postApplication(postedBy, jobTitle, location, keySkills, jobDesc) {
    const query = 'INSERT INTO public.application (postedby, jobTitle, location, keySkills, jobDesc, created_at) VALUES ($1, $2, $3, $4, $5) returning jobId';
    const values = [postedBy, jobTitle, location, keySkills, jobDesc];
    try {
      const result = await pool.query(query, values);
      return { success: true, jobId: result.rows[0].jobId };
    } catch(error) {
      console.error('Error posting application', error);
    }
  };

  
  
  module.exports = {
    postApplication,

  };