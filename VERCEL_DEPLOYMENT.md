# Vercel Deployment Guide

## Quick Deploy

1. **Connect GitHub Repository**
   - Go to https://vercel.com/new
   - Import `zeroniah/counterfactual-frontend`
   - Vercel auto-detects Create React App settings

2. **Configure Environment Variable**
   - Settings → Environment Variables → Add
   - Key: `REACT_APP_API_URL`
   - Value: `https://backend.vitalgnosis.com` (or your backend URL)
   - Apply to: Production, Preview, Development

3. **Deploy**
   - Click "Deploy"
   - Vercel builds from `main` branch automatically
   - Build command: `npm run build`
   - Output directory: `build`

4. **Custom Domain** (Optional)
   - Settings → Domains → Add
   - Enter: `counterfactual.vitalgnosis.com`
   - Add CNAME record in DNS: `cname.vercel-dns.com`

## Automatic Deployments

Every push to `main` branch triggers:
- ✅ Build verification
- ✅ Deployment to production
- ✅ CDN cache invalidation

Preview deployments created for:
- Pull requests
- Non-main branch pushes

## Build Configuration

**vercel.json** handles:
- Static file routing (`/guide/*`, `/static/*`)
- SPA fallback (`/` → `/index.html`)
- Environment variables injection

**package.json** includes:
- `vercel-build` script for Vercel's build system
- React Scripts build optimizations

## Testing Locally

```bash
# Install Vercel CLI
npm i -g vercel

# Run local preview
vercel dev

# Preview production build
npm run build
vercel --prod
```

## Monitoring

- Dashboard: https://vercel.com/zeroniah/counterfactual-frontend
- Analytics: Automatic page view tracking
- Logs: Real-time function execution logs
- Performance: Core Web Vitals monitoring

## Rollback

If deployment fails:
```bash
vercel rollback [deployment-url]
```

Or via dashboard: Deployments → Previous → Promote to Production
