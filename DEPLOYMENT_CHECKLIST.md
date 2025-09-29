# Deployment CHECKLIST (Auth-101)

1) Git push
   - git add .
   - git commit -m "..."
   - git push

2) Health endpoint
   - /api/health → 200 ve {"ok":true,"service":"auth-101"}

3) Vercel import
   - Framework: Next.js
   - Build: npm run build
   - Install: npm ci
   - Output: .next

4) Project link (lokalde)
   - npx -y vercel@latest link --project auth-101 --yes

5) Runtime standardı
   - vercel.json → nodejs18.x
   - API handler: export const runtime = 'nodejs'
   - İmza: export async function GET(req: Request) { ... }

6) Duman testi (canlı)
   - curl -s https://auth-101-livid.vercel.app/api/health

