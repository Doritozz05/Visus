# Database Maintenance & Hybrid Sync

This document covers the maintenance tasks, cron jobs, and realtime sync configuration for the Visus Supabase project.

## 1. Sync Cleanup Job (pg_cron)

To keep the `deleted_records` table from growing indefinitely, we use a daily cleanup job.

### Setup
Run the following SQL in the Supabase SQL Editor:

```sql
-- Enable the pg_cron extension
create extension if not exists pg_cron;

-- Create the cleanup job (runs every day at 3:00 AM)
select cron.schedule(
  'production-sync-cleanup',
  '0 3 * * *',
  $$ DELETE FROM deleted_records WHERE deleted_at < NOW() - INTERVAL '30 days' $$
);
```

### Verification
You can check the status of the job by running:
```sql
select * from cron.job_run_details order by start_time desc limit 10;
```

---

## 2. Hybrid Realtime Sync Setup

Visus uses a hybrid synchronization model:
- **Hydration Sync**: Incremental or Full reconciliation upon page load.
- **Realtime Sync**: Live updates via WebSockets for concurrent sessions.
- **Trigger Enforcement**: Strict 3-book limit enforcement at the database level.

### SQL Migration
Apply the migration found in `supabase/migrations/20260610_hybrid_sync_setup.sql`. This script:
1. Enables Realtime for `books_metadata` and `deleted_records`.
2. Sets `REPLICA IDENTITY FULL` for data integrity in payloads.
3. Creates the `enforce_cloud_book_limit` trigger.

### Enabling Realtime in Supabase Dashboard
While the SQL migration attempts to enable Realtime via `alter publication`, it is recommended to verify this in the Supabase Dashboard:
1. Go to **Database** > **Replication**.
2. Click on **'supabase_realtime'** publication.
3. Ensure `books_metadata` and `deleted_records` are selected.
4. Ensure the columns you need (all of them) are included (usually default).

### Troubleshooting Sync
If Realtime sync is not working:
- Check the browser console for "Realtime binary download failed".
- Verify that the user has a stable internet connection.
- Ensure that `REPLICA IDENTITY FULL` was successfully applied to the tables (`\d+ table_name` in SQL editor).
- Check the **Realtime** logs in the Supabase Dashboard for connection errors.

---

## 3. Quota Management
The free tier allows **3 cloud-stored books** per user. 

### Trigger Logic
The `enforce_cloud_book_limit` trigger runs `BEFORE INSERT OR UPDATE`. If a user attempts to mark a 4th book as `is_in_cloud = true`, the database will raise an exception with error code `P0003`. 

The frontend catches this error and:
1. Notifies the user.
2. Deletes any partially uploaded binary from Supabase Storage to prevent orphaned files.
