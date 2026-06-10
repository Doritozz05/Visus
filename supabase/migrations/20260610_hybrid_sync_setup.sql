-- 1. Enable Realtime for the required tables
-- This adds the tables to the supabase_realtime publication
alter publication supabase_realtime add table books_metadata;
alter publication supabase_realtime add table deleted_records;

-- 2. Set Replica Identity to FULL to get old and new values in the payload
-- This is crucial for correctly identifying which record changed or was deleted
alter table books_metadata replica identity full;
alter table deleted_records replica identity full;

-- 3. Create function to enforce the 3-cloud-book limit
create or replace function check_cloud_book_limit()
returns trigger as $$
declare
    cloud_count integer;
begin
    -- Only check if the book is being marked as in the cloud
    if NEW.is_in_cloud = true then
        -- Count how many books are ALREADY in the cloud for this user
        -- Exclude the current book if it's an update (to allow updating existing cloud books)
        select count(*)
        into cloud_count
        from public.books_metadata
        where user_id = NEW.user_id 
          and is_in_cloud = true
          and id != NEW.id;

        if cloud_count >= 3 then
            raise exception 'Cloud limit reached: You can only store up to 3 books in the cloud on the free tier.'
                using errcode = 'P0003'; -- Custom error code for client-side detection
        end if;
    end if;
    return NEW;
end;
$$ language plpgsql;

-- 4. Create trigger to run BEFORE INSERT OR UPDATE
drop trigger if exists enforce_cloud_book_limit on books_metadata;
create trigger enforce_cloud_book_limit
before insert or update on books_metadata
for each row execute function check_cloud_book_limit();
