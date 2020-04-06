const crypto = require('crypto');
const yup = require('yup');

const connection = require('../database/connection');

module.exports = {
  async store (req, res) {
    const schema = yup.object().shape({
      name: yup.string()
        .required(),
      email: yup.string()
        .email()
        .required(),
      whatsapp: yup.string()
        .required(),
      city: yup.string()
        .required(),
      uf: yup.string()
        .required()
        .max(2),    
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const { name, email, whatsapp, city, uf } = req.body;

    const notExist = await connection('ongs').where('name', name).first();

    if (notExist) {
      return res.status(400).json({ error: 'Name already exist'});
    }

    const id = crypto.randomBytes(4).toString('HEX');

    await connection('ongs').insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf,
    })

    return res.status(200).json({ id });
  },

  async show (req, res) {
    try{
      const ongs = await connection('ongs').select('*');

      return res.status(200).json(ongs);
    } catch (error) {
      return res.status(500).json({
        message: 'geting ong operation failed',
        error,
      });
    }
  },

  async update (req, res) {
    try{
      const schema = yup.object().shape({
        name: yup.string(),
        email: yup.string().email(),
        whatsapp: yup.string(),
        city: yup.string(),
        uf: yup.string().max(2),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ erro: 'Validation fails' });
      }
      
      const ong_id = req.headers.authorization;
      const { email = null, name = null } = req.body;

      const Ong = await connection('ongs')
        .where('id', ong_id)
        .select('name', 'email')
        .first(); 

      if (email !== Ong.email || name !== Ong.name) {
        const ongEmail = await connection('ongs')
          .where('email', email)
          .first();  
        
        const ongName = await connection('ongs')
          .where('name', name)
          .first();  

        if (ongEmail && ongName) {
          return res.status(400).json({ error: 'Email and Name already exists' });  
        } else if (ongEmail) {
          return res.status(400).json({ error: 'Email already exists' });
        } else if (ongName) {
          return res.status(400).json({ error: 'Name already exists' });
        }
      }

      await connection('ongs')
        .update(req.body)
        .where('id', ong_id);

      return res.status(200).json({ 
        message: 'ONG updated successfully'
      });
      
    } catch (error) {
      return res.status(500).json({
        message: 'Geting ONG operation failed',
        error,
      });
    }
  },

  async delete (req, res) {
    try{
      const ong_id = req.headers.authorization;

      await connection('ongs')
        .join('incidents', 'incidents.ong_id', '=', 'ongs.id')
        .where('id', ong_id)
        .delete();

      return res.status(204).send();

     } catch (error) {
       return res.status(500).json({
         message: 'Geting ong operation failed',
         error,
       });
     }     
  }
};