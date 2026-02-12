from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  kafka_topic: str = "test"
  kafka_server: str = "localhost:9092"
  redis_host: str = "localhost"
  redis_port: int = 6379
  redis_db: int = 0
  mariadb_user: str
  mariadb_password: str
  mariadb_host: str
  mariadb_database: str
  mariadb_port: int
  react_url: str
  secret_key: str
  algorithm: str
  access_token_expire_minutes: int

  model_config = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8",
    extra="ignore"
  )

settings = Settings()
