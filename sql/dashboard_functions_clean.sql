-- SQL Functions for Dashboard
-- Copy and run these functions in your Supabase SQL Editor

-- Function 1: Get time series data of feedback over time
CREATE OR REPLACE FUNCTION get_feedback_time_series()
RETURNS TABLE (
  date TEXT,
  count INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(DATE_TRUNC('day', f.created_at), 'YYYY-MM-DD') AS date,
    COUNT(f.feedback_key)::INTEGER AS count
  FROM 
    feedbacks f
  WHERE 
    f.created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY 
    DATE_TRUNC('day', f.created_at)
  ORDER BY 
    DATE_TRUNC('day', f.created_at);
END;
$$;

-- Function 2: Get positive feedback examples
CREATE OR REPLACE FUNCTION get_positive_feedback_examples(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  id TEXT,
  content TEXT,
  source TEXT,
  role TEXT,
  sentiment TEXT,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.feedback_key::TEXT,
    f.content,
    f.source,
    f.role,
    f.sentiment,
    f.created_at
  FROM 
    feedbacks f
  WHERE 
    f.sentiment = 'Positive'
  ORDER BY 
    f.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Function 3: Get negative feedback examples
CREATE OR REPLACE FUNCTION get_negative_feedback_examples(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  id TEXT,
  content TEXT,
  source TEXT,
  role TEXT,
  sentiment TEXT,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.feedback_key::TEXT,
    f.content,
    f.source,
    f.role,
    f.sentiment,
    f.created_at
  FROM 
    feedbacks f
  WHERE 
    f.sentiment = 'Negative'
  ORDER BY 
    f.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Function 4: Get dashboard counts and metrics
CREATE OR REPLACE FUNCTION get_dashboard_counts()
RETURNS TABLE (
  feedback INTEGER,
  insights INTEGER,
  actionItems INTEGER,
  sentimentScore FLOAT,
  newFeedback INTEGER,
  newInsights INTEGER,
  newActionItems INTEGER,
  sentimentTrend FLOAT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sentiment_score FLOAT;
  prev_sentiment_score FLOAT;
BEGIN
  -- Get total counts
  feedback := (SELECT COUNT(*) FROM feedbacks);
  insights := (SELECT COUNT(*) FROM insights);
  actionItems := (SELECT COUNT(*) FROM actionitems);
  
  -- Calculate sentiment score (percentage of positive feedback)
  SELECT 
    CASE 
      WHEN COUNT(*) > 0 THEN 
        (COUNT(CASE WHEN sentiment = 'Positive' THEN 1 END)::FLOAT / COUNT(*)::FLOAT) * 10
      ELSE 0 
    END INTO sentiment_score
  FROM feedbacks;
  
  -- Calculate previous period sentiment score
  SELECT 
    CASE 
      WHEN COUNT(*) > 0 THEN 
        (COUNT(CASE WHEN sentiment = 'Positive' THEN 1 END)::FLOAT / COUNT(*)::FLOAT) * 10
      ELSE 0 
    END INTO prev_sentiment_score
  FROM feedbacks
  WHERE created_at BETWEEN CURRENT_DATE - INTERVAL '60 days' AND CURRENT_DATE - INTERVAL '30 days';
  
  -- Get new counts from last 30 days
  newFeedback := (SELECT COUNT(*) FROM feedbacks WHERE created_at >= CURRENT_DATE - INTERVAL '30 days');
  newInsights := (SELECT COUNT(*) FROM insights WHERE created_at >= CURRENT_DATE - INTERVAL '30 days');
  newActionItems := (SELECT COUNT(*) FROM actionitems WHERE created_at >= CURRENT_DATE - INTERVAL '30 days');
  
  -- Calculate sentiment trend
  sentimentTrend := sentiment_score - prev_sentiment_score;
  
  -- Set return values
  RETURN QUERY
  SELECT 
    feedback,
    insights,
    actionItems,
    sentiment_score AS sentimentScore,
    newFeedback,
    newInsights,
    newActionItems,
    sentimentTrend;
END;
$$;

-- Function 5: Get role distribution
CREATE OR REPLACE FUNCTION get_role_distribution()
RETURNS TABLE (
  name TEXT,
  value INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(f.role, 'Unknown') AS name,
    COUNT(f.feedback_key)::INTEGER AS value
  FROM 
    feedbacks f
  GROUP BY 
    COALESCE(f.role, 'Unknown')
  ORDER BY 
    value DESC
  LIMIT 10;
END;
$$;

-- Function 6: Get ARR distribution
CREATE OR REPLACE FUNCTION get_arr_distribution()
RETURNS TABLE (
  name TEXT,
  value INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE
      WHEN company_arr < 10 THEN 'Less than 10M'
      WHEN company_arr BETWEEN 10 AND 50 THEN '10M-50M'
      WHEN company_arr BETWEEN 51 AND 100 THEN '51M-100M'
      WHEN company_arr > 100 THEN 'Over 100M'
      ELSE 'Unknown'
    END AS name,
    COUNT(f.feedback_key)::INTEGER AS value
  FROM 
    feedbacks f
  GROUP BY 
    name
  ORDER BY 
    value DESC;
END;
$$;

-- Function 7: Get employee count distribution
CREATE OR REPLACE FUNCTION get_employee_count_distribution()
RETURNS TABLE (
  name TEXT,
  value INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE
      WHEN employee_count < 100 THEN 'Less than 100'
      WHEN employee_count BETWEEN 100 AND 500 THEN '100-500'
      WHEN employee_count BETWEEN 501 AND 1000 THEN '501-1000'
      WHEN employee_count BETWEEN 1001 AND 5000 THEN '1001-5000'
      WHEN employee_count > 5000 THEN 'Over 5000'
      ELSE 'Unknown'
    END AS name,
    COUNT(f.feedback_key)::INTEGER AS value
  FROM 
    feedbacks f
  GROUP BY 
    name
  ORDER BY 
    value DESC;
END;
$$;

-- Function 8: Get sources distribution
CREATE OR REPLACE FUNCTION get_sources_distribution()
RETURNS TABLE (
  name TEXT,
  value INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(f.source, 'Unknown') AS name,
    COUNT(f.feedback_key)::INTEGER AS value
  FROM 
    feedbacks f
  GROUP BY 
    COALESCE(f.source, 'Unknown')
  ORDER BY 
    value DESC;
END;
$$;

-- Function 9: Get sentiment distribution
CREATE OR REPLACE FUNCTION get_sentiment_distribution()
RETURNS TABLE (
  name TEXT,
  value INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(f.sentiment, 'Neutral') AS name,
    COUNT(f.feedback_key)::INTEGER AS value
  FROM 
    feedbacks f
  GROUP BY 
    COALESCE(f.sentiment, 'Neutral')
  ORDER BY 
    value DESC;
END;
$$;

-- Function 10: Export dashboard to Slack (placeholder)
CREATE OR REPLACE FUNCTION export_dashboard_to_slack()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- This is a placeholder. In a real implementation, you would:
  -- 1. Collect the necessary dashboard data
  -- 2. Format it for Slack
  -- 3. Use pg_net or similar extension to make an HTTP call to Slack's API
  -- 4. Return success/failure status
  
  -- For now, we'll just return a success message
  result := jsonb_build_object(
    'success', true,
    'message', 'Dashboard exported to Slack successfully'
  );
  
  RETURN result;
END;
$$; 