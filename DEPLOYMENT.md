# Production Deployment Guide for Mission Manager MCP Server

This guide provides instructions for deploying the Mission Manager MCP Server in a production environment, focusing on Docker Compose, cloud platforms, and security best practices.

## 1. Docker Compose Deployment

For self-hosted deployments, Docker Compose is the recommended method. Ensure Docker and Docker Compose are installed on your server.

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Configure Environment Variables**:
    Create a `.env` file based on `.env.example` and set `PORT=8765` (or your desired port).

3.  **Start the Services**:
    ```bash
    docker-compose up -d
    ```

4.  **Verify Deployment**:
    Check container status and health:
    ```bash
    docker-compose ps
    curl http://localhost:8765/health
    ```

## 2. Cloud Platform Deployment

### AWS EC2
1.  **Launch EC2 Instance**: Choose an appropriate instance type.
2.  **Install Docker & Docker Compose**: Follow official guides.
3.  **Security Group Configuration**: Open port 8765 (TCP) to your desired IP ranges (e.g., your office IP or 0.0.0.0/0 for public access).
4.  **Deploy**: Follow Docker Compose deployment steps.

### Google Cloud Run
1.  **Containerize Application**: Ensure your `Dockerfile` is optimized.
2.  **Build and Push Image**: Push your Docker image to Google Container Registry (GCR) or Artifact Registry.
3.  **Deploy to Cloud Run**: Configure the service to listen on port 8765.

### Azure App Service
1.  **Container Image**: Use your Docker image from a registry.
2.  **Configuration**: Set `WEBSITES_PORT` environment variable to `8765`.

## 3. Reverse Proxy Setup (Optional but Recommended)

Using a reverse proxy like Nginx or Caddy provides SSL termination, load balancing, and additional security.

### Nginx Example
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/yourdomain.com.crt;
    ssl_certificate_key /etc/nginx/ssl/yourdomain.com.key;

    location / {
        proxy_pass http://localhost:8765;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4. Firewall Configuration

Ensure your server's firewall allows incoming traffic on port 8765.

### UFW (Ubuntu/Debian)
```bash
sudo ufw allow 8765/tcp
sudo ufw enable
```

### iptables (CentOS/RHEL)
```bash
sudo iptables -A INPUT -p tcp --dport 8765 -j ACCEPT
sudo service iptables save
```

## 5. Environment Variables

Manage sensitive information and configurations using environment variables. Key variables:

-   `PORT`: The port the server listens on (e.g., `8765`)
-   `NODE_ENV`: Set to `production`
-   `DATABASE_PATH`: Path to the SQLite database (e.g., `/app/data/missions.db`)

## 6. Monitoring and Logging

-   **Logs**: Use `docker-compose logs -f mission-manager` to view container logs.
-   **Health Checks**: Monitor the `/health` endpoint.
-   **Resource Usage**: Use `docker stats` to monitor CPU and memory.

## 7. Backup and Restore Procedures

Regularly back up your persistent data volume (`./data`).

### Backup
```bash
tar -czf mission-manager-backup-$(date +%Y%m%d).tar.gz data/
```

### Restore
1.  Stop the service: `docker-compose down`
2.  Extract backup: `tar -xzf mission-manager-backup-YYYYMMDD.tar.gz`
3.  Restart the service: `docker-compose restart`

## 8. Scaling Strategies

For horizontal scaling, consider:
-   Using an external database (PostgreSQL, MySQL) instead of SQLite.
-   Implementing a load balancer.
-   Managing sessions for the MCP if it becomes stateful.

## 9. Migration Guide from Old Port (3000 to 8765)

This guide outlines the steps to migrate an existing Mission Manager deployment from the old port (3000) to the new port (8765).

1.  **Stop Old Deployment**:
    Stop the existing Mission Manager service. This might involve:
    ```bash
    sudo systemctl stop mission-manager  # If using systemd
    # OR
    docker-compose down                # If using Docker Compose with old config
    ```

2.  **Update Configuration Files**:
    Modify relevant configuration files to reflect the new port 8765. This includes:
    -   `opencode.jsonc`: Update the `mcpServers.mission-manager.url` to `http://localhost:8765/mcp`.
    -   `docker-compose.yml`: Update `ports` mapping to `"8765:8765"` and `environment.PORT` to `8765`.
    -   `.env.example` / `.env`: Set `PORT=8765`.
    -   `README.md`: Update any port references in documentation.
    -   `mission-manager.service` (if applicable): Update `Environment="PORT=8765"` or `ExecStart` command.

3.  **Start New Deployment**:
    Start the Mission Manager service with the updated configuration:
    ```bash
    docker-compose up -d
    # OR
    sudo systemctl start mission-manager
    ```

4.  **Update Firewall / Security Groups**:
    Ensure your firewall or cloud security groups allow incoming traffic on port 8765 and block port 3000 (if no other services use it).

5.  **Update API Clients**:
    Any clients or integrations that communicate with the Mission Manager MCP Server must be updated to use the new URL `http://localhost:8765/mcp`.

6.  **Test All Integrations**:
    Thoroughly test all functionalities and integrations to ensure the migration was successful.
    ```bash
    curl http://localhost:8765/health
    # Test MCP endpoint (if functional)
    curl -X POST http://localhost:8765/mcp -H "Content-Type: application/json" -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "list_missions", "arguments": {}}}'
    ```
