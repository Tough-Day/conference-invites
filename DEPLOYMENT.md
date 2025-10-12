# Deployment Guide - Google Cloud Platform (GCP)

This guide walks you through deploying the Conference Invites Platform to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed and configured
3. **Docker** installed locally
4. **Git** repository (already initialized)

## Architecture

- **Frontend**: Static React app served via nginx on Cloud Run
- **Backend**: Node.js API on Cloud Run
- **Database**: Cloud SQL (PostgreSQL)

## Step 1: Setup GCP Project

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
export REGION="us-central1"

# Set the active project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable sql-component.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## Step 2: Create Cloud SQL Instance

```bash
# Create PostgreSQL instance
gcloud sql instances create conference-invites-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=$REGION \
  --root-password=YOUR_STRONG_PASSWORD

# Create database
gcloud sql databases create conference_invites \
  --instance=conference-invites-db

# Create database user
gcloud sql users create appuser \
  --instance=conference-invites-db \
  --password=YOUR_APP_PASSWORD
```

## Step 3: Build and Push Docker Images

### Setup Artifact Registry

```bash
# Create repository
gcloud artifacts repositories create conference-invites \
  --repository-format=docker \
  --location=$REGION

# Configure Docker authentication
gcloud auth configure-docker ${REGION}-docker.pkg.dev
```

### Build and Push Backend

```bash
cd backend

# Build Docker image
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/conference-invites/backend:latest .

# Push to Artifact Registry
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/conference-invites/backend:latest
```

### Build and Push Frontend

```bash
cd ../frontend

# Build Docker image
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/conference-invites/frontend:latest .

# Push to Artifact Registry
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/conference-invites/frontend:latest
```

## Step 4: Deploy Backend to Cloud Run

```bash
# Get Cloud SQL connection name
export INSTANCE_CONNECTION_NAME=$(gcloud sql instances describe conference-invites-db \
  --format='value(connectionName)')

# Deploy backend
gcloud run deploy conference-invites-backend \
  --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/conference-invites/backend:latest \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated \
  --add-cloudsql-instances=${INSTANCE_CONNECTION_NAME} \
  --set-env-vars="DATABASE_URL=postgresql://appuser:YOUR_APP_PASSWORD@localhost/conference_invites?host=/cloudsql/${INSTANCE_CONNECTION_NAME}" \
  --set-env-vars="NODE_ENV=production" \
  --set-env-vars="FRONTEND_URL=https://YOUR_FRONTEND_URL" \
  --memory=512Mi \
  --cpu=1 \
  --max-instances=10

# Get backend URL
export BACKEND_URL=$(gcloud run services describe conference-invites-backend \
  --platform=managed \
  --region=$REGION \
  --format='value(status.url)')

echo "Backend deployed at: $BACKEND_URL"
```

## Step 5: Run Database Migrations

The migrations run automatically on container startup via the Dockerfile CMD.
However, you can also run them manually:

```bash
# Connect to Cloud SQL
gcloud sql connect conference-invites-db --user=appuser

# Or use Cloud SQL Proxy locally
cloud_sql_proxy -instances=${INSTANCE_CONNECTION_NAME}=tcp:5432
```

## Step 6: Deploy Frontend to Cloud Run

```bash
cd ../frontend

# Deploy frontend
gcloud run deploy conference-invites-frontend \
  --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/conference-invites/frontend:latest \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated \
  --port=8080 \
  --memory=256Mi \
  --cpu=1 \
  --max-instances=10

# Get frontend URL
export FRONTEND_URL=$(gcloud run services describe conference-invites-frontend \
  --platform=managed \
  --region=$REGION \
  --format='value(status.url)')

echo "Frontend deployed at: $FRONTEND_URL"
```

## Step 7: Update Backend with Frontend URL

```bash
# Update backend with correct FRONTEND_URL and CORS settings
gcloud run services update conference-invites-backend \
  --platform=managed \
  --region=$REGION \
  --set-env-vars="FRONTEND_URL=${FRONTEND_URL}"
```

## Step 8: Configure Custom Domain (Optional)

```bash
# Map custom domain to frontend
gcloud run domain-mappings create \
  --service=conference-invites-frontend \
  --domain=yourdomain.com \
  --region=$REGION

# Map custom domain to backend API
gcloud run domain-mappings create \
  --service=conference-invites-backend \
  --domain=api.yourdomain.com \
  --region=$REGION
```

Update DNS records as instructed by the command output.

## Environment Variables Reference

### Backend Required Variables:
- `DATABASE_URL`: PostgreSQL connection string (with Cloud SQL socket)
- `NODE_ENV`: Set to "production"
- `FRONTEND_URL`: Full URL of your frontend deployment
- `PORT`: Set to 8080 (Cloud Run default)

### Backend Optional Variables:
- `SHORT_URL_API_KEY`: For URL shortening service
- `SHORT_URL_API_ENDPOINT`: URL shortening API endpoint
- `HUBSPOT_API_KEY`: For HubSpot integration
- `GCS_BUCKET_NAME`: Google Cloud Storage bucket for file uploads
- `GCS_PROJECT_ID`: GCP project ID for storage

### Frontend Variables:
- API URL is hardcoded in the Docker build for production

To change the frontend API URL, rebuild the Docker image with the backend URL.

## Monitoring and Logs

```bash
# View backend logs
gcloud run services logs read conference-invites-backend --limit=50

# View frontend logs
gcloud run services logs read conference-invites-frontend --limit=50

# Follow logs in real-time
gcloud run services logs tail conference-invites-backend
```

## Updating the Application

```bash
# Rebuild and push images
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/conference-invites/backend:latest ./backend
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/conference-invites/backend:latest

# Deploy new version (Cloud Run will handle rolling updates)
gcloud run deploy conference-invites-backend \
  --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/conference-invites/backend:latest \
  --platform=managed \
  --region=$REGION
```

## Cost Optimization

1. **Cloud Run**: Free tier includes 2 million requests/month
2. **Cloud SQL**: Use f1-micro tier for development ($7-10/month)
3. **Storage**: Minimal costs for database storage
4. **Networking**: Outbound traffic may incur charges

For production, consider:
- Scaling Cloud SQL to db-n1-standard-1 or higher
- Setting up Cloud CDN for frontend assets
- Implementing Cloud Armor for DDoS protection

## Troubleshooting

### Backend won't connect to database
- Verify Cloud SQL instance is running
- Check `DATABASE_URL` environment variable format
- Ensure Cloud SQL connector is added to the service

### CORS errors
- Verify `FRONTEND_URL` matches your actual frontend URL
- Check backend CORS configuration in `src/index.ts`

### Migrations failing
- Check database credentials
- Verify Prisma schema matches your requirements
- Check backend logs for specific migration errors

## Security Checklist

- [ ] Database has strong passwords
- [ ] Environment variables are set correctly
- [ ] Cloud Run services have appropriate IAM permissions
- [ ] Cloud SQL has authorized networks configured
- [ ] Consider enabling Cloud Armor for production
- [ ] Enable HTTPS (automatic with Cloud Run)
- [ ] Review and limit Cloud Run max instances for cost control

## Support

For issues or questions:
1. Check Cloud Run logs
2. Verify all environment variables
3. Test locally with production-like configuration
4. Review GCP quotas and limits
