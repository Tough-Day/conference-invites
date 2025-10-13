# Custom Domain Setup Guide: forms.tough.day

## Overview
This guide will help you map the custom domain `forms.tough.day` to your Conference Invites application running on Google Cloud Run.

## Prerequisites
- Access to DNS management for `tough.day` domain
- Google Cloud project: `events-474922`
- Cloud Run services deployed in `us-central1`

## Step 1: Verify Domain Ownership

### Option A: Via Google Cloud Console (Recommended)
1. Go to: https://console.cloud.google.com/run/domains?project=events-474922
2. Click **"Add Mapping"**
3. Select service: `conference-invites-frontend`
4. Enter domain: `forms.tough.day`
5. Follow the verification prompts

### Option B: Via gcloud CLI
```bash
# Add domain mapping (this will provide verification instructions)
gcloud beta run domain-mappings create \
  --service=conference-invites-frontend \
  --domain=forms.tough.day \
  --region=us-central1
```

## Step 2: Add DNS Records

After starting the domain mapping process, Google will provide DNS records. You'll need to add these to your `tough.day` DNS configuration:

### DNS Records to Add

**For Domain Verification** (if not already verified):
```
Type: TXT
Name: @ (or tough.day)
Value: google-site-verification=<provided-value>
```

**For the Subdomain**:
```
Type: CNAME
Name: forms
Value: ghs.googlehosted.com
```

### Where to Add DNS Records

If your DNS is managed by:
- **Cloudflare**: DNS → Records → Add Record
- **Google Domains**: DNS → Custom records
- **GoDaddy**: DNS → Manage DNS → Add Record
- **Namecheap**: Advanced DNS → Add New Record
- **Route 53 (AWS)**: Hosted zones → Create record

## Step 3: Wait for DNS Propagation

- DNS changes can take 5 minutes to 48 hours to propagate
- Check propagation status: https://dnschecker.org/#CNAME/forms.tough.day
- Google Cloud will automatically provision SSL certificate once DNS is verified

## Step 4: Update Application URLs

Once the domain is mapped, update these configurations:

### Backend CORS Configuration
File: `backend/src/index.ts`

Find the CORS configuration and update allowed origins:
```typescript
const allowedOrigins = [
  'https://conference-invites-frontend-615509061125.us-central1.run.app',
  'https://forms.tough.day',  // Add this
  'http://localhost:3000',
  'http://localhost:3001'
];
```

### Frontend API Configuration (if using environment variables)
Update `VITE_API_URL` in your frontend configuration to use the custom domain if needed.

### Update Generated URLs
The application generates form URLs - ensure these use the custom domain:
```typescript
formUrl: `https://forms.tough.day/form/${slug}`
```

## Step 5: Test the Setup

Once DNS propagates and SSL is provisioned:

1. **Test Dashboard Access**:
   ```bash
   curl -I https://forms.tough.day
   ```

2. **Test API Endpoint**:
   ```bash
   curl https://forms.tough.day/api/conferences
   ```

3. **Test Form Creation**:
   - Visit https://forms.tough.day
   - Click "New Event"
   - Create a test form

## Step 6: Set Up Backend Custom Domain (Optional)

For a cleaner setup, you can also map a subdomain for the backend:

### Backend Domain: `api.tough.day`

```bash
gcloud beta run domain-mappings create \
  --service=conference-invites-backend \
  --domain=api.tough.day \
  --region=us-central1
```

**DNS Record**:
```
Type: CNAME
Name: api
Value: ghs.googlehosted.com
```

Then update frontend nginx.conf:
```nginx
location /api/ {
    proxy_pass https://api.tough.day;
    # ... rest of config
}
```

## Troubleshooting

### Domain Mapping Not Working
- Verify DNS records are correct: `dig forms.tough.day`
- Check domain verification status in Cloud Console
- Ensure CNAME points to `ghs.googlehosted.com`

### SSL Certificate Not Provisioning
- Wait 15-30 minutes after DNS propagation
- Verify domain ownership is complete
- Check Cloud Run → Domain Mappings for certificate status

### 404 or 502 Errors
- Ensure service is publicly accessible (allUsers has run.invoker role)
- Check Cloud Run logs for errors
- Verify nginx configuration in frontend

### DNS Not Propagating
- Check TTL values (lower values propagate faster)
- Use `dig` or `nslookup` to verify:
  ```bash
  dig forms.tough.day CNAME
  nslookup forms.tough.day
  ```
- Clear local DNS cache:
  ```bash
  # macOS
  sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
  
  # Windows
  ipconfig /flushdns
  
  # Linux
  sudo systemd-resolve --flush-caches
  ```

## Current Service URLs

**Frontend (current)**:
- https://conference-invites-frontend-615509061125.us-central1.run.app

**Backend (current)**:
- https://conference-invites-backend-615509061125.us-central1.run.app

**Frontend (after custom domain)**:
- https://forms.tough.day

**Backend (if custom domain added)**:
- https://api.tough.day

## Security Considerations

1. **SSL/TLS**: Google Cloud Run automatically provisions and manages SSL certificates
2. **CORS**: Update allowed origins in backend
3. **Firewall**: Cloud Run services are protected by Google's infrastructure
4. **Authentication**: Consider adding authentication if not public

## Monitoring

After setup, monitor:
- **SSL Certificate Expiry**: Auto-renewed by Google
- **DNS Health**: Use monitoring tools to track uptime
- **Cloud Run Logs**: Check for any custom domain related errors

## Support Resources

- [Cloud Run Custom Domains Documentation](https://cloud.google.com/run/docs/mapping-custom-domains)
- [Domain Verification Help](https://cloud.google.com/storage/docs/domain-name-verification)
- [DNS Propagation Checker](https://dnschecker.org)

---

**Last Updated**: October 2025
**Project**: Conference Invites Platform (events-474922)
**Region**: us-central1
