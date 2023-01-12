var sql = require("mssql/msnodesqlv8");

const options = {
  user: 'NodeUser',
  password: 'NodeUser',
  server: 'localhost',
  database: "Laba14NodeJs",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

class Repository {
  constructor() {
    this.pool = new sql.ConnectionPool(options);
  }

  async execute(query) {
    const connect = await this.pool.connect();
    console.log(query);
    const response = await connect.query(query);
    console.log(response);
    return response.recordset;
  }

  async getAll(tableName) { 
    const connect = await this.pool.connect();
    const response = await connect.query(`SELECT * FROM ${tableName}`);
    console.log("response: ", response);
    return response.recordset;
  }

  async getOne(tableName, fields) {
    const connect = await this.pool.connect();
    const request = connect.request();
    let command = `SELECT TOP(1) * FROM ${tableName} WHERE`;
    Object.keys(fields).forEach((field) => {
      let fieldType = Number.isInteger(fields[field]) ? sql.Int : sql.NVarChar;
      request.input(field, fieldType, fields[field]);
      command += ` ${field} = @${field} AND`;
    });
    command = command.slice(0, -3);
    const response = await request.query(command);

    return response.recordset;
  }

  async insertOne(tableName, fields) {
    const connect = await this.pool.connect();
    const request = connect.request();
    let command = `INSERT INTO ${tableName} values (`;
    Object.keys(fields).forEach((field) => {
      let fieldType = Number.isInteger(fields[field]) ? sql.Int : sql.NVarChar;
      request.input(field, fieldType, fields[field]);
      command += `@${field},`;
    });
    command = command.replace(/.$/, ")");
    return await request.query(command);
  }

  async updateOne(tableName, fields) {
    const connect = await this.pool.connect();
    const request = connect.request();

    const idField = tableName;
    if (!fields[idField]) {
      throw "Bad requests  table name params. Example: {TableName}";
    }

    let command = `UPDATE ${tableName} SET `;
    Object.keys(fields).forEach((field) => {
      let fieldType = Number.isInteger(fields[field]) ? sql.Int : sql.NVarChar;
      request.input(field, fieldType, fields[field]);
      if (!field.endsWith(tableName)) {
        command += `${field} = @${field},`;
      }
    });
    command = command.slice(0, -1);
    command += ` WHERE ${idField} = @${idField}`;
    return await request.query(command);
  }

  async deleteOne(tableName, id) {
    const connect = await this.pool.connect();

    if (!id) {
      throw "ID params not found. Example: /api/instances/:id";
    }

    return await connect.query(
      `DELETE FROM ${tableName} WHERE ${tableName} LIKE '${id}%'`
    );
  }
}

module.exports = Repository;
