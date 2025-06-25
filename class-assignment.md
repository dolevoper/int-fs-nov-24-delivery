1. Choose DB hosting
    * Postgres on render (30 days limit)
    * SQLite on turso (libsql)
    * Postgres on supabase
    * MySql on any other platform
2. Run DB migration script
3. Install the relevant node module for your db (sqlite3, mysql2, pg, libsql)
4. Connect to DB
    * Add connection string/details to ENV
    * Connect in app.ts
5. Replace code in models to use SQL instead of mongo
6. Uninstall mongoose
