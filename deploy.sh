#!/usr/bin/env bash
set -e

# ==============================================================================
# Automated Deployment Script: Minimarket + API Gateway + S3 Database
# Usage: ./deploy.sh [s3://your-bucket-name/minimarket_db.sql]
# Note: Ensure your EC2 instance has an IAM Role or 'aws configure' credentials
#       with s3:GetObject permissions to download from S3.
# ==============================================================================

S3_SOURCE="${1:-s3://minimarket-db-bucket/minimarket_db.sql}"

echo "=========================================="
echo " Starting Minimarket Deployment"
echo "=========================================="

# 1. Download database dump from AWS S3 using AWS CLI
if [ ! -f "init.sql" ]; then
    echo "--> [1/2] Downloading database dump from AWS S3 ($S3_SOURCE)..."
    aws s3 cp "$S3_SOURCE" ./init.sql
else
    echo "--> [1/2] init.sql already exists locally. Skipping download."
fi

# 2. Launch container stack using Docker Compose
echo "--> [2/2] Launching container services with Docker Compose..."
docker compose up -d

echo "=========================================="
echo " Deployment completed successfully!"
echo " Status: Spring Boot app and PostgreSQL are private (zero exposed ports)."
echo " API Gateway entry point active on port: ${GATEWAY_PORT:-8082}"
echo "=========================================="

