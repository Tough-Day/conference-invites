# Conference Invites Management System

A full-stack web application for managing conference lead capture forms with QR codes, analytics, and data export capabilities.

## Features

- **Conference Management**: Create and manage multiple conference forms
- **Dynamic Form Builder**: Add, remove, and customize form fields
- **Custom Branding**: Configure logos, colors, and copy for each conference
- **QR Code Generation**: Automatic QR code creation for each form
- **Short URLs**: Integration with URL shortening service
- **Analytics Dashboard**: Track page views, submissions, and conversion rates
- **Data Export**: Export submissions to CSV or HubSpot
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL (via Prisma ORM)
- QRCode generation

### Frontend
- React + TypeScript
- Vite
- React Router
- React Hook Form
- Tailwind CSS
- Lucide Icons

### Hosting
- Google Cloud Run (containers)
- Google Cloud SQL (PostgreSQL)

## Project Structure

```
conference-invites/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── routes/                # API routes
│   │   │   ├── conferences.ts
│   │   │   ├── submissions.ts
│   │   │   └── analytics.ts
│   │   ├── utils/                 # Utilities
│   │   │   ├── qrCode.ts
│   │   │   ├── shortUrl.ts
│   │   │   └── export.ts
│   │   ├── db.ts                  # Prisma client
│   │   └── index.ts               # Main server
│   ├── Dockerfile
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/                 # React pages
    │   │   ├── Dashboard.tsx
    │   │   ├── ConferenceCreate.tsx
    │   │   ├── ConferenceDetail.tsx
    │   │   ├── PublicForm.tsx
    │   │   └── SubmissionSuccess.tsx
    │   ├── services/              # API client
    │   │   └── api.ts
    │   ├── types/                 # TypeScript types
    │   │   └── index.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── Dockerfile
    ├── nginx.conf
    └── package.json
```

## Local Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials and API keys:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/conference_invites"
PORT=3001
SHORT_URL_API_KEY=your_api_key
SHORT_URL_API_ENDPOINT=https://api.example.com/shorten
HUBSPOT_API_KEY=your_hubspot_key
```

5. Run Prisma migrations:
```bash
npx prisma migrate dev
```

6. Generate Prisma client:
```bash
npx prisma generate
```

7. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Google Cloud Deployment

### Prerequisites
- Google Cloud account
- Google Cloud CLI installed
- Docker installed

### 1. Set up Google Cloud SQL (PostgreSQL)

```bash
# Create a Cloud SQL instance
gcloud sql instances create conference-invites-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# Create a database
gcloud sql databases create conference_invites \
  --instance=conference-invites-db

# Create a user
gcloud sql users create appuser \
  --instance=conference-invites-db \
  --password=YOUR_SECURE_PASSWORD
```

### 2. Deploy Backend to Cloud Run

```bash
cd backend

# Build and push Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/conference-invites-backend

# Deploy to Cloud Run
gcloud run deploy conference-invites-backend \
  --image gcr.io/YOUR_PROJECT_ID/conference-invites-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:conference-invites-db \
  --set-env-vars DATABASE_URL="postgresql://appuser:password@/conference_invites?host=/cloudsql/YOUR_PROJECT_ID:us-central1:conference-invites-db" \
  --set-env-vars PORT=3001 \
  --set-env-vars SHORT_URL_API_KEY=your_key \
  --set-env-vars HUBSPOT_API_KEY=your_key
```

### 3. Deploy Frontend to Cloud Run

```bash
cd frontend

# Build and push Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/conference-invites-frontend

# Deploy to Cloud Run
gcloud run deploy conference-invites-frontend \
  --image gcr.io/YOUR_PROJECT_ID/conference-invites-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_API_URL=https://YOUR_BACKEND_URL
```

### 4. Set up Custom Domain (Optional)

```bash
# Map your domain to the frontend service
gcloud run domain-mappings create \
  --service conference-invites-frontend \
  --domain your-domain.com \
  --region us-central1
```

## Short URL API Integration

The application is designed to integrate with a URL shortening service. To configure:

1. Update `backend/src/utils/shortUrl.ts` with your API's endpoint structure
2. Set the `SHORT_URL_API_KEY` and `SHORT_URL_API_ENDPOINT` environment variables
3. The API will be called automatically when creating a new conference

Example API integration:
```typescript
const response = await fetch(apiEndpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({ url: longUrl }),
});
```

## HubSpot Integration

To enable HubSpot export:

1. Get your HubSpot API key from HubSpot Settings > Integrations > API Key
2. Set the `HUBSPOT_API_KEY` environment variable
3. The export feature will map form fields to HubSpot contact properties

## API Documentation

### Conferences

- `GET /api/conferences` - List all conferences
- `GET /api/conferences/:slug` - Get conference by slug
- `POST /api/conferences` - Create new conference
- `PUT /api/conferences/:id` - Update conference
- `DELETE /api/conferences/:id` - Delete conference
- `GET /api/conferences/:id/qrcode` - Get QR code for conference

### Submissions

- `GET /api/submissions/conference/:conferenceId` - Get submissions for a conference
- `POST /api/submissions` - Create new submission (public endpoint)
- `GET /api/submissions/conference/:conferenceId/export/csv` - Export as CSV
- `POST /api/submissions/conference/:conferenceId/export/hubspot` - Export to HubSpot

### Analytics

- `POST /api/analytics/track` - Track an event (page view, QR scan, etc.)
- `GET /api/analytics/conference/:conferenceId` - Get analytics for a conference
- `GET /api/analytics/overview` - Get overall stats

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models:

- **Conference**: Conference details, branding, URLs
- **FormField**: Dynamic form field configuration
- **Submission**: Form submission data (JSON)
- **Analytics**: Event tracking (page views, submissions, QR scans)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

ISC
