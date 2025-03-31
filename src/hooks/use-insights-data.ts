
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type InsightItem = {
  id: number;
  title: string;
  content: string;
  sentiment: string;
  relatedFeedbackIds: number[];
};

export const useInsightsData = (filters: Record<string, string>) => {
  const [selectedInsight, setSelectedInsight] = useState<InsightItem | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Fetch insights data
  const fetchInsightsData = async (): Promise<InsightItem[]> => {
    let query = supabase.from("insights").select("*");

    // Apply filters if they exist
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        // For insights, we have to handle filtering differently
        // We'll filter related feedbacks after fetching
        if (key !== "source" && key !== "segment" && key !== "sentiment") {
          query = query.eq(key, value);
        }
      }
    });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching insights data:", error);
      throw new Error("Failed to fetch insights data");
    }

    // Get related feedbacks for each insight
    const insightsWithRelatedFeedbacks = await Promise.all(
      (data || []).map(async (insight) => {
        const { data: relatedData, error: relatedError } = await supabase
          .from("insights_feedbacks")
          .select("feedback_key")
          .eq("insight_key", insight.insight_key);

        if (relatedError) {
          console.error("Error fetching related feedbacks:", relatedError);
          return {
            id: insight.insight_key,
            title: insight.content?.split("\n")[0] || "No title",
            content: insight.content || "",
            sentiment: "neutral", // Default sentiment
            relatedFeedbackIds: [],
          };
        }

        return {
          id: insight.insight_key,
          title: insight.content?.split("\n")[0] || "No title",
          content: insight.content || "",
          sentiment: "neutral", // Default sentiment
          relatedFeedbackIds: relatedData.map((item) => item.feedback_key) || [],
        };
      })
    );

    return insightsWithRelatedFeedbacks;
  };

  const {
    data: insightItems,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["insightsData", filters],
    queryFn: fetchInsightsData,
  });

  // Function to fetch related feedbacks for a specific insight
  const fetchRelatedFeedbacks = async (insightId: number) => {
    const { data, error } = await supabase
      .from("insights_feedbacks")
      .select("feedback_key")
      .eq("insight_key", insightId);

    if (error) {
      console.error("Error fetching related feedbacks:", error);
      return [];
    }

    const feedbackIds = data.map((item) => item.feedback_key);

    const { data: feedbackData, error: feedbackError } = await supabase
      .from("feedbacks")
      .select("*")
      .in("feedback_key", feedbackIds);

    if (feedbackError) {
      console.error("Error fetching feedbacks:", feedbackError);
      return [];
    }

    return feedbackData.map((item) => ({
      id: item.feedback_key,
      content: item.content || "",
      source: item.source || "",
      segment: item.segment || "",
      sentiment: item.sentiment || "",
      createdAt: item["Creation Date"] || new Date().toISOString(),
      customerId: item.customer_id || 0,
    }));
  };

  return {
    insightItems: insightItems || [],
    isLoading,
    isError,
    refetch,
    selectedInsight,
    setSelectedInsight,
    fetchRelatedFeedbacks,
    isFiltering,
    setIsFiltering,
  };
};
