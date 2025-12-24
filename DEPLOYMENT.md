# Cloudflare Pages Deployment Guide

## Environment Configuration

### Setting Environment Variables in Cloudflare Pages

1. Go to your Cloudflare Pages project dashboard
2. Navigate to **Settings** → **Environment variables**
3. Add the following variable:

   **Variable name:** `NEXT_PUBLIC_API_URL`  
   **Value:** `https://lighthouse-backend.lighthousevercel.workers.dev/api`

4. Apply to **Production** and **Preview** environments

### Local Development

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=https://lighthouse-backend.lighthousevercel.workers.dev/api
```

Or for local backend testing:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Deployment Steps

### Automatic Deployment (Recommended)

Your GitHub repository is already connected to Cloudflare Pages. Simply push your changes:

```bash
git add .
git commit -m "Configure API endpoint for production"
git push origin main
```

Cloudflare Pages will automatically:
1. Detect the push
2. Run `npm run build` (which uses `@cloudflare/next-on-pages`)
3. Deploy to your Pages URL

### Manual Build Test

Before pushing, test the build locally:

```bash
cd frontend
npm run build
```

This runs `next build` which will catch any build errors before deployment.

## Verification

After deployment:

1. Visit your Cloudflare Pages URL
2. Test login functionality
3. Check browser console for API errors
4. Verify all dashboard features work with the production backend

## Troubleshooting

**Issue:** API calls failing  
**Solution:** Verify `NEXT_PUBLIC_API_URL` is set in Cloudflare Pages environment variables

**Issue:** Build fails  
**Solution:** Check build logs in Cloudflare Pages dashboard, ensure all dependencies are in `package.json`

**Issue:** 404 errors on routes  
**Solution:** Cloudflare Pages with `@cloudflare/next-on-pages` handles routing automatically, no additional configuration needed
