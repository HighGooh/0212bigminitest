import json
from kafka import KafkaProducer

from src.core.settings import settings

# Kafka PD 설정
pd = KafkaProducer(
  bootstrap_servers=settings.kafka_server,
  value_serializer=lambda v: json.dumps(v).encode("utf-8")
)