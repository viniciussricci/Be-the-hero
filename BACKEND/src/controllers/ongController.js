const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async store (req, res) {
    const { name, email, whatsapp, city, uf } = req.body;

    const id = crypto.randomBytes(4).toString('HEX');

    const notExist = await connection('ongs').where('name', name).first();

    if (notExist) {
      return res.status(400).json({ error: 'User already exist'});
    }

    await connection('ongs').insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf,
    })

    return res.json({ id });
  },

  async show (req, res) {
    const ongs = await connection('ongs').select('*');

    return res.json(ongs);
  },

  async delete (req, res) {
    const ong_id = req.headers.authorization;

    await connection('ongs').where('id', ong_id).delete();

    await connection('incidents').where('ong_id', ong_id).delete('*');

    return res.status(204).send();
  }
};