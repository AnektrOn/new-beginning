# Profile Picture Debug Guide

## Issues Identified:
1. ✅ **Profile tab centering fixed** - Added proper flexbox centering
2. ⚠️ **Profile picture not appearing** - Need to debug avatar_url

## Debug Steps:

### 1. Check Console Logs
Open browser console and look for:
```
Profile data: { ... }
Avatar URL: [URL or null]
```

### 2. Check Database
Run this SQL in Supabase to check if avatar_url is set:
```sql
SELECT id, full_name, avatar_url FROM profiles WHERE id = 'your-user-id';
```

### 3. Check Storage Bucket
Make sure you've run the avatars storage bucket SQL:
```sql
-- Run CREATE_AVATARS_STORAGE_BUCKET.sql in Supabase SQL Editor
```

### 4. Test Profile Picture Upload
1. Go to Settings tab
2. Try uploading a profile picture
3. Check if it saves successfully
4. Check if avatar_url gets updated in profiles table

### 5. Force Profile Refresh
If avatar_url is set but not showing, try:
1. Sign out and sign back in
2. Or refresh the page
3. Or check if profile data is being refetched

## Expected Behavior:
- Profile picture should appear as background in Level Card
- If no picture, should show default dark background
- Console should show the avatar_url value

## Next Steps:
1. Run the SQL files if not done
2. Test profile picture upload in Settings
3. Check console logs for avatar_url
4. Verify database has the avatar_url value
