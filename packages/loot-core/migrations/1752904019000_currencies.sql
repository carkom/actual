BEGIN TRANSACTION;

CREATE TABLE currencies
  (
    id TEXT PRIMARY KEY,
    index_value TEXT,
    currency TEXT,
    commit_date TEXT,
    rate INTEGER DEFAULT 1,
    tombstone INTEGER DEFAULT 0
  );

COMMIT;