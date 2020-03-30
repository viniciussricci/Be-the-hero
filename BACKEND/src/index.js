const express = require('express');
const routes = require('./routes');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json()); // Definindo que utilizaremos JSON nas requisições
app.use(routes);


app.listen(3333);

/**
 * Métodos HTTTP
 * 
 * GET: Buscar uma informação no backend
 * POST: Criar uma informação no backend
 * PUT: Alterar uma informação no backend
 * DELETE: Deletar uma informação no backend
 */

/**
 * Tipos de Parametros
 * 
 * Route Query: Parâmetros nomeados e enviados na rota após "?" (Filtros, paginação concat com &)
 * Route params: Parâmetros utilizados para identificar recursos (:id)
 * Request Body: Corpo da requisição utilizado para criar ou alterar informações.
 */

 /**
  * SQL: MySQL, SQLite, PostgreSQL, Oracle, Microsoft SQL Server
  * NoSQL: MongoDB, CouchDB, etc
  */

 