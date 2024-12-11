from pymongo import MongoClient

class MongoDBManager:
    def __init__(self):
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["WSD-Assignment-03"]

    def close(self):
        self.client.close()
