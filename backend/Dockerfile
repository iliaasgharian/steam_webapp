# Base image: lightweight official Python image
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only requirements first (better Docker layer caching:
# dependencies won't be reinstalled every time app code changes)
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the backend code
COPY . .

# Make sure the entrypoint script is executable (Windows git checkouts
# sometimes drop the executable bit)
RUN chmod +x entrypoint.sh

# FastAPI/uvicorn will listen on this port inside the container
EXPOSE 8000

# entrypoint.sh creates the database tables (if missing) and then
# starts the server, listening on all interfaces so it's reachable
# from outside the container
CMD ["./entrypoint.sh"]
