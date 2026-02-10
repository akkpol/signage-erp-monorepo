## 🌐 **Cloud Database Setup (แนะนำสำหรับแรมน้อย)**

### ทำไมต้องใช้ Cloud Database?

| | Local PostgreSQL | Cloud Database |
|---|---|---|
| **แรมที่กิน** | ~200-500 MB | **0 MB** ✅ |
| **Setup time** | 15-30 นาที | **5 นาที** ✅ |
| **Backup** | ทำเอง | **Auto** ✅ |
| **Deploy** | ต้อง migrate | **พร้อมใช้** ✅ |
| **ราคา** | ฟรี | **ฟรี** ✅ |

### ตัวเลือก Cloud Database (Free Tier):

#### 1. **Neon.tech** ⭐ แนะนำสุด!
- **Free tier:** 0.5GB storage, unlimited queries
- **ไม่ต้อง credit card**
- **Auto-sleep** เมื่อไม่ใช้งาน (ประหยัด resources)
- **Serverless** - เร็วมาก

**Setup 3 นาที:**
```
1. ไป https://neon.tech
2. Sign up with GitHub
3. Create project → เลือก region: Singapore
4. Copy connection string
5. Paste ใน apps/api/.env
```

#### 2. **Supabase**
- **Free tier:** 500MB storage
- **มี Admin Panel** สวยมาก
- **มี Storage, Auth** built-in
- ต้องยืนยัน email

**Setup 5 นาที:**
```
1. ไป https://supabase.com
2. Sign up
3. Create new project
4. Settings → Database → Connection string
5. Paste ใน apps/api/.env
```

### Quick Start:

```bash
# 1. สมัคร Neon.tech (3 นาที)
# 2. Copy connection string เช่น:
# postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/dbname

# 3. Paste ใน .env
cd apps/api
echo "DATABASE_URL=postgresql://..." > .env

# 4. Run migration
npx prisma migrate dev --name init

# 5. ✅ Done!
```

**ดู workflow ละเอียด:** `/prisma` workflow
