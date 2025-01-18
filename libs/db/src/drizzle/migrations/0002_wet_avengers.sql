CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE INDEX "detailsTemplate_gin_idx" ON "Job" USING gin ("detailsTemplate" gin_trgm_ops);