const { Kafka } = require('kafkajs');
require('dotenv').config(); 


class KafkaConsumer 
{

    constructor()
    {
        this.consumer = this.createKafkaConsumer();
    }

    createKafkaConsumer()
    {
        const kafka = new Kafka({
            clientId: process.env.kafkaClientId,
            brokers: [process.env.kafkaBrokerAddress], // Replace with your Kafka broker address
            enableAutoCommit: false 
        });
          
        let consumer = kafka.consumer({ groupId: 'test-group' });
        return consumer;
    }

    async stop()
    {
      await this.consumer.disconnect();
      console.log("disconnect")
    }

    async ack(opt)
    {
      await this.consumer.commitOffsets([opt]);
    }

    async connect(retry)
    {
      console.log("Connecting....")
      await this.consumer.connect().then(()=>{ }).catch(()=>{

        if(retry < 5)
          this.connect(retry++);
      });
    }

    async run()
    {
      let me = this;

      let retry = 0;

      await this.connect();


      await this.consumer.subscribe({ topic: process.env.kafkaTopic, fromBeginning: true }); // Replace 'my-topic'
    
      await this.consumer.run({
        autoCommit: true,
        eachMessage: async ({ topic, partition, message }) => {
          
          /*console.log({
            value: message.value.toString(),
          });*/


          if(me.onKafkaMessageArrived != null)
          {
            let msg = message.value.toString();
            try
            {
              msg = JSON.parse(msg)
            }
            catch(e)
            {

            }
            me.onKafkaMessageArrived(msg, message,
            {
              topic,
              partition,
              offset: Number(message.offset).toString()
            })

          }
        },
      });

      const shutdown = async () => {
        console.log('Disconnecting consumer...');
        await me.consumer.disconnect();
        console.log('Consumer disconnected.');
        process.exit(0); // Exit with success code
      };
    
      process.on('SIGINT', shutdown); 
      process.on('SIGTERM', shutdown); 


    }
}

module.exports = KafkaConsumer;