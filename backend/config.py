import os

APP_ENVIRONMENT = os.getenv( "APPLICATION_ENVIRONMENT", "production")
DEBUG = APP_ENVIRONMENT == "development"
HOST = os.getenv("APPLICATION_HOST", "0.0.0.0")
PORT = os.getenv("APPLICATION_PORT", 3001)
