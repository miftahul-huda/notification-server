const { Kafka } = require('kafkajs');
require('dotenv').config(); 


class KafkaProducer 
{

    constructor()
    {
        this.producer = this.createKafkaProducer();
        this.createTopic();
    }

    createKafkaProducer()
    {
        console.log("KAFKA Broker Address")
        console.log(process.env.kafkaBrokerAddress)
        const kafka = new Kafka({
            clientId: process.env.kafkaClientId,
            brokers: [process.env.kafkaBrokerAddress] // Replace with your Kafka broker address
          });
          
        let producer = kafka.producer();
        return producer;
    }

    async createTopic()
    {
      const kafka = new Kafka({
        clientId: process.env.kafkaClientId,
        brokers: [process.env.kafkaBrokerAddress] // Replace with your Kafka broker address
      });
      
      let admin = kafka.admin();
      await admin.connect();

      // Create a topic with 3 partitions and a replication factor of 1
      console.log( process.env.kafkaTopic)
      await admin.createTopics({
        topics: [{
          topic: process.env.kafkaTopic,
          numPartitions: 1,
          replicationFactor: 1
        }]
      }).catch((ee)=>{
        console.log("error create topic")
        console.log(ee)
      });

      console.log('Topic created successfully!');
      await admin.disconnect();
    }


    async send(message)
    {
        await this.producer.connect();

        const kafkaMessage = {
          topic: process.env.kafkaTopic, // Replace with your desired topic
          messages: [ { value : message }]
        };
      
        await this.producer.send(kafkaMessage);
        await this.producer.disconnect();
    }
}

module.exports = KafkaProducer;