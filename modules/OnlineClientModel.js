const { Model, DataTypes } = require('sequelize');

class OnlineClientModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            clientID: DataTypes.STRING,
            session: DataTypes.STRING,
            fullName: DataTypes.STRING,
            info: DataTypes.STRING,
            message: DataTypes.TEXT
        }, 
        { sequelize, modelName: 'OnlineClient', tableName: 'OnlineClient', force: force });
    }
}

module.exports = OnlineClientModel;