# Cloudflare Zero Trust Setup

## Prerequisites
- Cloudflare account with Zero Trust enabled
- Domain configured in Cloudflare

## Steps

### 1. Create Cloudflare Tunnel
```bash
cloudflared tunnel create permit-tunnel
```
Save the tunnel ID and credentials file path.

### 2. Configure Tunnel
Edit `cloudflare/cloudflared-config.yml`:
- Replace `YOUR_TUNNEL_ID` with your tunnel ID
- Replace `YOUR_TUNNEL_ID.json` with actual credentials filename
- Update `permits.yourdomain.com` with your domain

### 3. Create DNS Record
```bash
cloudflared tunnel route dns permit-tunnel permits.yourdomain.com
```

### 4. Configure Access Policy
1. Go to Cloudflare Zero Trust Dashboard → Access → Applications
2. Create new application:
   - Name: Permit Processing App
   - Domain: permits.yourdomain.com
   - Type: Self-hosted
3. Add policies (e.g., email domain, specific emails)
4. Note your team domain: `yourteam.cloudflareaccess.com`
5. Note the Application Audience (AUD) tag

### 5. Update Environment Variables
In `.env`:
```
CF_ACCESS_AUD=your_aud_tag_here
CF_TEAM_DOMAIN=yourteam.cloudflareaccess.com
```

### 6. Run Tunnel
```bash
cloudflared tunnel --config cloudflare/cloudflared-config.yml run permit-tunnel
```

Or install as a service:
```bash
sudo cloudflared service install
```

## Validating Access Tokens
The app validates Cloudflare Access JWT tokens to ensure requests come through the tunnel.
See `src/lib/auth/cloudflare.ts` for implementation.
