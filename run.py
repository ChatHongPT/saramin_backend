from app.models.db_init import initialize_mongodb
from app.models.schemas import initialize_postgresql
from app.crawlers.crawler import crawl_saramin

if __name__ == "__main__":
    # Initialize MongoDB and PostgreSQL
    initialize_mongodb()
    initialize_postgresql()

    # Start crawling and saving to MongoDB
    print("Starting the crawler...")
    crawl_saramin(pages=25)
    print("Crawling completed.")
