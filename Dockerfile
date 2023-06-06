# Use the official PostgreSQL Docker image
FROM postgres

# Set the environment variables for the PostgreSQL database
ENV POSTGRES_USER my_username
ENV POSTGRES_PASSWORD my_password
ENV POSTGRES_DB my_database

# Copy the SQL script to create the database table
COPY ./create_table.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL default port
EXPOSE 5432
