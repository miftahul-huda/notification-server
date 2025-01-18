IP_ADDRESS=$(hostname -I | awk '{print $1}')
#sudo docker pull wurstmeister/zookeeper
#sudo docker pull wurstmeister/kafka
sudo docker run -d  -p 2181:2181 \
  --name zookeeper \
  wurstmeister/zookeeper 

sudo docker run -d -p 9092:9092 \
    --name kafka \
    -e KAFKA_ADVERTISED_HOST_NAME="$IP_ADDRESS" \
    -e KAFKA_ZOOKEEPER_CONNECT="$IP_ADDRESS:2181" \
    wurstmeister/kafka 


sudo docker pull asia-southeast2-docker.pkg.dev/telkomsel-retail-intelligence/devoteam/notification-producer-server:latest
sudo docker pull asia-southeast2-docker.pkg.dev/telkomsel-retail-intelligence/devoteam/notification-consumer-server:latest
# Get the IP address using hostname -I


# Run the image
sudo docker run -p 1421:1421 -d \
    -e kafkaClientId="app-notification-client" \
    -e kafkaBrokerAddress="$IP_ADDRESS:9092" \
    -e kafkaTopic="app-notification" \
    -e nodeKafkaProducerPort=1421 \
    -e nodeKafkaConsumerPort=1422 \
    asia-southeast2-docker.pkg.dev/telkomsel-retail-intelligence/devoteam/notification-producer-server:latest

# Run the image
# Run the image
sudo docker run -p 1422:1422 -d \
    -e kafkaClientId="app-notification-client" \
    -e kafkaBrokerAddress="$IP_ADDRESS:9092" \
    -e kafkaTopic="app-notification" \
    -e nodeKafkaProducerPort=1421 \
    -e nodeKafkaConsumerPort=1422 \
    asia-southeast2-docker.pkg.dev/telkomsel-retail-intelligence/devoteam/notification-consumer-server:latest
