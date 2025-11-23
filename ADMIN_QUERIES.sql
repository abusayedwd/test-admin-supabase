-- Admin SQL Queries for Report Management

-- 1. View all pending reports with user information
SELECT 
  r.id,
  r.report_type,
  r.category,
  r.title,
  r.description,
  r.content_id,
  r.created_at,
  u.email as reporter_email,
  u.raw_user_meta_data->>'full_name' as reporter_name
FROM reports r
LEFT JOIN auth.users u ON r.user_id = u.id
WHERE r.status = 'pending'
ORDER BY r.created_at DESC;

-- 2. Count reports by type and status
SELECT 
  report_type,
  status,
  COUNT(*) as count
FROM reports
GROUP BY report_type, status
ORDER BY report_type, status;

-- 3. View AI chatbot reports with message content
SELECT 
  r.id,
  r.title,
  r.description,
  r.content_data->>'message_content' as message_content,
  r.content_data->>'message_index' as message_index,
  r.context_data->>'session_id' as session_id,
  r.created_at,
  u.email as reporter_email
FROM reports r
LEFT JOIN auth.users u ON r.user_id = u.id
WHERE r.report_type = 'ai_chatbot'
ORDER BY r.created_at DESC;

-- 4. View AI explanation reports with verse information
SELECT 
  r.id,
  r.title,
  r.description,
  r.content_data->>'surah_number' as surah_number,
  r.content_data->>'verse_number' as verse_number,
  r.content_data->>'explanation' as explanation,
  r.context_data->>'surah_name' as surah_name,
  r.created_at,
  u.email as reporter_email
FROM reports r
LEFT JOIN auth.users u ON r.user_id = u.id
WHERE r.report_type = 'ai_explanation'
ORDER BY r.created_at DESC;

-- 5. View hadith reports with book and chapter info
SELECT 
  r.id,
  r.title,
  r.description,
  r.content_data->>'book_name' as book_name,
  r.content_data->>'chapter_name' as chapter_name,
  r.content_data->>'hadith_number' as hadith_number,
  r.content_data->>'grade' as hadith_grade,
  r.created_at,
  u.email as reporter_email
FROM reports r
LEFT JOIN auth.users u ON r.user_id = u.id
WHERE r.report_type = 'hadith'
ORDER BY r.created_at DESC;

-- 6. Reports requiring urgent attention (older than 7 days and still pending)
SELECT 
  r.id,
  r.report_type,
  r.category,
  r.title,
  r.created_at,
  EXTRACT(days FROM (NOW() - r.created_at)) as days_old,
  u.email as reporter_email
FROM reports r
LEFT JOIN auth.users u ON r.user_id = u.id
WHERE r.status = 'pending' 
  AND r.created_at < NOW() - INTERVAL '7 days'
ORDER BY r.created_at ASC;

-- 7. Most active reporters (users who submit many reports)
SELECT 
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name,
  COUNT(r.id) as report_count,
  MAX(r.created_at) as last_report_date
FROM reports r
JOIN auth.users u ON r.user_id = u.id
GROUP BY u.id, u.email, u.raw_user_meta_data->>'full_name'
HAVING COUNT(r.id) > 5
ORDER BY report_count DESC;

-- 8. Reports by category breakdown
SELECT 
  category,
  COUNT(*) as total_reports,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'reviewing' THEN 1 END) as reviewing,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
  COUNT(CASE WHEN status = 'dismissed' THEN 1 END) as dismissed
FROM reports
GROUP BY category
ORDER BY total_reports DESC;

-- 9. Recent activity (reports from last 7 days)
SELECT 
  DATE(created_at) as report_date,
  report_type,
  category,
  COUNT(*) as reports_count
FROM reports
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at), report_type, category
ORDER BY report_date DESC, reports_count DESC;

-- 10. Update report status and add admin notes (template)
-- UPDATE reports 
-- SET 
--   status = 'resolved',
--   admin_notes = 'Issue has been reviewed and content updated accordingly.',
--   resolved_at = NOW(),
--   resolved_by = '[ADMIN_USER_ID]'
-- WHERE id = '[REPORT_ID]';

-- 11. Find duplicate or similar reports
SELECT 
  r1.id as report_1_id,
  r2.id as report_2_id,
  r1.title,
  r1.content_id,
  r1.category,
  r1.created_at as report_1_date,
  r2.created_at as report_2_date
FROM reports r1
JOIN reports r2 ON r1.content_id = r2.content_id 
  AND r1.id < r2.id
  AND r1.report_type = r2.report_type
WHERE r1.content_id IS NOT NULL
ORDER BY r1.content_id, r1.created_at;

-- 12. Performance metrics - average resolution time
SELECT 
  report_type,
  category,
  COUNT(*) as resolved_reports,
  AVG(EXTRACT(days FROM (resolved_at - created_at))) as avg_resolution_days,
  MIN(EXTRACT(days FROM (resolved_at - created_at))) as min_resolution_days,
  MAX(EXTRACT(days FROM (resolved_at - created_at))) as max_resolution_days
FROM reports
WHERE status = 'resolved' AND resolved_at IS NOT NULL
GROUP BY report_type, category
ORDER BY avg_resolution_days DESC;

-- 13. Monthly report trends
SELECT 
  DATE_TRUNC('month', created_at) as month,
  report_type,
  COUNT(*) as report_count
FROM reports
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at), report_type
ORDER BY month DESC, report_type;

-- 14. Export data for specific report (with all details)
-- SELECT 
--   r.*,
--   u.email as reporter_email,
--   u.raw_user_meta_data->>'full_name' as reporter_name,
--   admin_user.email as resolved_by_email
-- FROM reports r
-- LEFT JOIN auth.users u ON r.user_id = u.id
-- LEFT JOIN auth.users admin_user ON r.resolved_by = admin_user.id
-- WHERE r.id = '[SPECIFIC_REPORT_ID]';

-- 15. Bulk status update for similar reports
-- UPDATE reports 
-- SET 
--   status = 'dismissed',
--   admin_notes = 'Bulk update: This type of content has been reviewed and is within acceptable guidelines.',
--   resolved_at = NOW(),
--   resolved_by = '[ADMIN_USER_ID]'
-- WHERE report_type = 'ai_chatbot' 
--   AND category = 'technical_error' 
--   AND status = 'pending'
--   AND created_at < NOW() - INTERVAL '30 days'; 