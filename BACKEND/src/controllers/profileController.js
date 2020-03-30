const connection = require ('../database/connection');

module.exports = {
  async showSpecific (req, res) {
    const ong_id = req.headers.authorization

    const isValid = await connection('ongs').where('id', ong_id).first();

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid autorizathion ID' });
    }
    
    const incidents = await connection('incidents')
      .where('ong_id', ong_id)
      .select('*');
      
    return res.json({
      Total: incidents.length,
      Incidentes: incidents
    });  
  }
};