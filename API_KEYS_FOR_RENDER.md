# Getron - Ultimate AI Platform: API Keys for Render Deployment

## 🔑 **REQUIRED API KEYS (You have these)**

### **1. Gemini API Key** ✅
```
GEMINI_API_KEY=AIzaSyDynJkTlhIsQls1bgsZ3ydBMHfrda_wPPA
```
- **Source**: Google AI Studio (already configured)
- **Purpose**: Powers all 8 AI capabilities

### **2. Supabase Database Keys** ✅
```
SUPABASE_URL=https://wszbkkdhlzpwjrexvyrl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[YOUR_SERVICE_ROLE_KEY]
```
- **Source**: Your existing Supabase project
- **URL**: https://supabase.com/dashboard/project/wszbkkdhlzpwjrexvyrl

## 🔑 **MISSING API KEYS (You need to get these)**

### **1. JWT Secret Key** - REQUIRED for authentication
```
JWT_SECRET_KEY=your_super_secret_jwt_key_here
```
- **Generate**: Use any secure random string (e.g., from https://randomkeygen.com/)
- **Example**: `my_super_secret_jwt_key_12345!@#$%^&*()`
- **Purpose**: Secures user authentication

### **2. Supabase Service Role Key** - REQUIRED for database operations
- **Get from**: https://supabase.com/dashboard/project/wszbkkdhlzpwjrexvyrl/settings/api
- **Copy the `service_role` key** (it should be different from anon key)
- **Format**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **3. Supabase Anon Key** - REQUIRED for frontend
- **Get from**: https://supabase.com/dashboard/project/wszbkkdhlzpwjrexvyrl/settings/api  
- **Copy the `anon` key**
- **Format**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🚀 **RENDER DEPLOYMENT - Environment Variables**

When deploying to Render, add these environment variables:

### **Required (Backend)**
```bash
GEMINI_API_KEY=AIzaSyDynJkTlhIsQls1bgsZ3ydBMHfrda_wPPA
SUPABASE_URL=https://wszbkkdhlzpwjrexvyrl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY_FROM_SUPABASE]
JWT_SECRET_KEY=[YOUR_GENERATED_JWT_SECRET]
```

### **Optional (Performance)**
```bash
REDIS_URL=redis://localhost:6379/0  # Optional caching
DEBUG=false
ENVIRONMENT=production
CORS_ORIGINS=https://getron.netlify.app,https://your-render-url.onrender.com
```

## 📋 **How to Get Missing Keys**

### **1. JWT Secret Key**
```bash
# Option 1: Generate online
https://randomkeygen.com/ → Generate "Secure Random Password"

# Option 2: Generate locally
openssl rand -hex 32
```

### **2. Supabase Service Role Key**
1. Go to: https://supabase.com/dashboard/project/wszbkkdhlzpwjrexvyrl/settings/api
2. Copy the `service_role` key (NOT the anon key)
3. It should be longer than the anon key

### **3. Supabase Anon Key**
1. Go to: https://supabase.com/dashboard/project/wszbkkdhlzpwjrexvyrl/settings/api
2. Copy the `anon` public key
3. This is shorter than the service role key

## ✅ **Complete Environment for Render**

Copy this exact format to Render environment variables:

```bash
# AI Service
GEMINI_API_KEY=AIzaSyDynJkTlhIsQls1bgsZ3ydBMHfrda_wPPA

# Database (Supabase)
SUPABASE_URL=https://wszbkkdhlzpwjrexvyrl.supabase.co
SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SUPABASE_SERVICE_ROLE_KEY]

# Security
JWT_SECRET_KEY=[YOUR_JWT_SECRET_KEY]

# Configuration
ENVIRONMENT=production
DEBUG=false
API_PORT=8000
API_HOST=0.0.0.0
CORS_ORIGINS=https://getron.netlify.app,https://your-render-url.onrender.com
```

## 🎯 **Priority Order**

1. **Get JWT Secret Key** (2 minutes)
2. **Get Supabase Service Role Key** (2 minutes)  
3. **Get Supabase Anon Key** (2 minutes)
4. **Deploy to Render** (5 minutes)

**Total time to get all keys: ~6 minutes!**