const { Sequelize, DataTypes } = require('sequelize');
const ClientModel = require("./clientmodel")
require('dotenv').config(); 


class Database 
{

    constructor()
    {
        // Connect to SQLite database
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'clientdata.db', // Replace with your desired database file name
            logging: false
        });

        // Define a User model
        ClientModel.initialize(sequelize);
        sequelize.sync();
    }

    addClient(client)
    {
        let promise =  new Promise((resolve, reject)=>{
            try{ 
                ClientModel.create(client).then(()=>{
                    resolve();
                })
            }
            catch(e) {
                reject(e);
            }
        })
        return promise;
    }

    getAllClients()
    {
        let promise =  new Promise((resolve, reject)=>{
            try{ 
                ClientModel.findAll().then((clients)=>{
                    resolve(clients);
                })

            }
            catch(e) {
                reject(e);
            }
        })
        return promise;
    }
    
    getClient(clientID)
    {
        let promise =  new Promise((resolve, reject)=>{
            try{ 
                ClientModel.findOne({where: { clientID : clientID } }).then((result)=>{
                    resolve(result);
                })
            }
            catch(e) {
                reject(e);
            }
        })
        return promise;
    }

    removeClient(cliendID)
    {
        let promise =  new Promise((resolve, reject)=>{
            try{ 
                ClientModel.destroy({where: { clientID : cliendID } }).then((result)=>{
                    resolve(result);
                })
            }
            catch(e) {
                reject(e);
            }
        })
        return promise;       
    }
}

module.exports = Database