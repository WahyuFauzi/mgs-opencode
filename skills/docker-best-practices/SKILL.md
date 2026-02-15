---
name: docker-best-practices
description: Docker containerization, image optimization, and development best practices
license: MIT
compatibility: opencode
metadata:
  audience: developers
  experience: intermediate
---

## What I do

Provide practical Docker guidance for containerizing applications, optimizing images, and managing development environments.

### Core Areas Covered

**Image Optimization**
- Multi-stage builds for smaller images
- Layer caching strategies
- Choosing appropriate base images (alpine, slim)
- Using .dockerignore effectively

**Dockerfile Best Practices**
- Instruction ordering for optimal caching
- Build args and environment variables
- User permissions and basic security
- Running as non-root user

**Docker Compose**
- Multi-container development environments
- Service dependencies and networking
- Volume management for development
- Environment-specific configurations

**Common Operations**
- Building and running containers
- Debugging container issues
- Managing images and containers
- Basic troubleshooting

## When to use me

Use this skill when you need to:
- Create or optimize Dockerfiles
- Set up development environments with Docker Compose
- Reduce Docker image size
- Containerize existing applications
- Debug container build or runtime issues
- Set up multi-service applications locally
- Understand Docker basics for a new project

### Common Scenarios

- **New application**: Create Dockerfile and compose setup from scratch
- **Optimization**: Reduce image size and improve build speed
- **Development**: Set up consistent local environment
- **Migration**: Move from local setup to containerized
- **Debugging**: Fix container networking, volumes, or build issues
- **Multi-service**: Connect database, cache, and app containers

## Guidelines

### Dockerfile Optimization

**Use Multi-Stage Builds:**

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**Layer Caching:**

```dockerfile
# BAD - changes invalidate cache for everything
COPY . .
RUN npm install

# GOOD - install dependencies first
COPY package*.json ./
RUN npm ci
COPY . .
```

**Minimal Base Images:**

```dockerfile
# ❌ Too large (~900MB)
FROM ubuntu:22.04

# ⚠️ Smaller (~120MB)
FROM node:18

# ✅ Minimal (~45MB)
FROM node:18-alpine
```

### Security Basics

**Use Non-Root User:**

```dockerfile
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs
```

**Don't Embed Secrets:**

```dockerfile
# ❌ Never do this
ENV API_KEY=secret123
COPY .env .

# ✅ Use environment at runtime
docker run -e API_KEY=secret123 myapp
```

**Use .dockerignore:**

```
# Prevent copying unnecessary files
node_modules
npm-debug.log
.git
.env
coverage
dist
```

### Dockerfile Structure

```dockerfile
# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies (layer cache)
COPY package*.json ./
RUN npm ci --only=production

# 4. Copy application code
COPY . .

# 5. Non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# 6. Expose port
EXPOSE 3000

# 7. Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js

# 8. Start command
CMD ["node", "app.js"]
```

### Docker Compose

**Basic Multi-Service Setup:**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://db:5432/app
    depends_on:
      - db
    volumes:
      - .:/app
      - node_modules:/app/node_modules

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
  node_modules:
```

**Development vs. Production:**

```yaml
# docker-compose.yml (development)
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app  # Live reload

# docker-compose.prod.yml (production override)
services:
  app:
    environment:
      - NODE_ENV=production
    restart: always
    volumes: []  # No live reload in production
```

### Common Commands

**Building Images:**

```bash
# Basic build
docker build -t myapp .

# Build with tag
docker build -t myapp:1.0.0 .

# Build without cache
docker build --no-cache -t myapp .

# Build from different Dockerfile
docker build -f Dockerfile.dev -t myapp-dev .
```

**Running Containers:**

```bash
# Run container
docker run -p 3000:3000 myapp

# Run in background
docker run -d -p 3000:3000 myapp

# Run with environment variables
docker run -e NODE_ENV=production -p 3000:3000 myapp

# Run and remove after exit
docker run --rm -p 3000:3000 myapp
```

**Docker Compose Commands:**

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Build and start
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Execute command in container
docker-compose exec app npm test
```

**Managing Containers:**

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# Remove all stopped containers
docker container prune

# View container logs
docker logs <container-id>
```

**Managing Images:**

```bash
# List images
docker images

# Remove image
docker rmi <image-id>

# Remove unused images
docker image prune -a

# Remove all unused data
docker system prune -a
```

### Debugging

**Shell into Running Container:**

```bash
docker exec -it <container-id> sh
docker-compose exec app bash
```

**View Container Stats:**

```bash
docker stats
```

**Inspect Container:**

```bash
docker inspect <container-id>
docker-compose config  # View compose config
```

### Build Args vs. Environment

```dockerfile
# Build args (build-time only)
ARG NODE_VERSION=18
FROM node:${NODE_VERSION}

# Environment variables (runtime)
ENV NODE_ENV=production

# Use build arg at build time
docker build --build-arg NODE_VERSION=16 -t myapp .
```

### Common Pitfalls to Avoid

- **COPY . . blindly** - Use .dockerignore to exclude unnecessary files
- **Installing as root** - Create and use non-root user
- **Embedding secrets** - Use environment variables at runtime
- **Using latest tag** - Pin specific versions in production
- **Large layers** - Order instructions to maximize cache hits
- **Ignoring volumes** - Properly mount data and cache directories
- **Forgetting health checks** - Add health checks for better monitoring

## Multi-Language Examples

**Python:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]
```

**Go:**

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o app

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /app/app .
CMD ["./app"]
```

**Ruby:**

```dockerfile
FROM ruby:3.2-slim

WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test

COPY . .

CMD ["rails", "server", "-b", "0.0.0.0"]
```

## Resources

- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Compose Specification](https://compose-spec.io/)
- [Docker Docs](https://docs.docker.com/)

## Ask Before Proceeding

Clarify these questions when needed:
- What language/framework is being containerized?
- What is the deployment target (local, cloud, on-prem)?
- Are there specific image size constraints?
- What databases or services need to be connected?
- Is this for development, production, or both?
