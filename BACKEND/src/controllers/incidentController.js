const yup = require('yup');

const connection = require('../database/connection');

module.exports = {
  async store (req, res) {
    const schema = yup.object().shape({
      title: yup.string().required(),
      description: yup.string().required(),
      value: yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    
    const { title, description, value } = req.body;
    const ong_id = req.headers.authorization;

    const isValid = await connection('ongs').where('id', ong_id).first();

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid autorizathion ID' });
    }

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      ong_id,
    });
    
    return res.status(200).json({ id });
  },

  async show (req, res) {
    try{
      const { page = 1 } = req.query;

      const [count] = await connection('incidents').count();

      const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page - 1) * 5)
        .select([
          'incidents.*', 
          'ongs.name', 
          'ongs.email', 
          'ongs.whatsapp', 
          'ongs.city', 
          'ongs.uf'
        ]);

      res.header('X-Total-Count', count['count(*)']);  

      return res.status(200).json(incidents);
    } catch (error) {
      return res.status(500).json({
        message: 'Geting incident operation failed',
        error,
      });
    }  
  },

  async delete (req, res) {
    try{
      const { id } = req.params;
      const ong_id = req.headers.authorization;

      const incident = await connection('incidents')
        .where('id', id)
        .select('ong_id')
        .first();

      if (incident.ong_id !== ong_id){
        return res.status(401).json({ error: 'Operation not permitted' });
      }  

      await connection('incidents').where('id', id).delete();

      return res.status(204).json({
        message: 'Successfully deleted'
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Geting incident operation failed',
        error,
      });
    }  
  }
};