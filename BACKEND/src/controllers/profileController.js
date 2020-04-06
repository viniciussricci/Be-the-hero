const connection = require ('../database/connection');

module.exports = {
  async showSpecific (req, res) {
    try{
      const ong_id = req.headers.authorization

      const isValid = await connection('ongs').where('id', ong_id).first();

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid autorizathion ID' });
      }
      
      const incidents = await connection('incidents')
        .where('ong_id', ong_id)
        .select('*');
        
      return res.json(incidents);  
    } catch (error) {
      return res.status(500).json({
        message: 'Geting profile operation failed',
        error,
      });
    }  
  }
};