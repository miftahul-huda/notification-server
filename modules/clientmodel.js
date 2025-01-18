const { Model, DataTypes } = require('sequelize');

class ClientModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            clientID: DataTypes.STRING,
            session: DataTypes.STRING,
            socket: DataTypes.TEXT,
            info: DataTypes.STRING,
            message: DataTypes.TEXT
        }, 
        { sequelize, modelName: 'Client', tableName: 'Client', force: force });
    }
}

module.exports = ClientModel;