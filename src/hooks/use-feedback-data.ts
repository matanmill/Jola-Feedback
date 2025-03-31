
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type FeedbackItem = {
  id: number;
  content: string;
  source: string;
  segment: string;
  sentiment: string;
  createdAt: string;
  customerId: number;
};

export const useFeedbackData = (filters: Record<string, string>) => {
  const [isFiltering, setIsFiltering] = useState(false);

  const fetchFeedbackData = async (): Promise<FeedbackItem[]> => {
    let query = supabase.from("feedbacks").select("*");

    // Apply filters if they exist
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching feedback data:", error);
      throw new Error("Failed to fetch feedback data");
    }

    // Map the data to our FeedbackItem type
    return (data || []).map((item) => ({
      id: item.feedback_key,
      content: item.content || "",
      source: item.source || "",
      segment: item.segment || "",
      sentiment: item.sentiment || "",
      createdAt: item["Creation Date"] || new Date().toISOString(),
      customerId: item.customer_id || 0,
    }));
  };

  const {
    data: feedbackItems,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["feedbackData", filters],
    queryFn: fetchFeedbackData,
  });

  const filterOptions = {
    source: Array.from(
      new Set(feedbackItems?.map((item) => item.source) || [])
    ).filter(Boolean),
    segment: Array.from(
      new Set(feedbackItems?.map((item) => item.segment) || [])
    ).filter(Boolean),
    sentiment: Array.from(
      new Set(feedbackItems?.map((item) => item.sentiment) || [])
    ).filter(Boolean),
  };

  return {
    feedbackItems: feedbackItems || [],
    isLoading,
    isError,
    refetch,
    filterOptions,
    isFiltering,
    setIsFiltering,
  };
};
