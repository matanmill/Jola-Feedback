
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ActionItem = {
  id: number;
  title: string;
  content: string;
  sentiment: string;
  relatedInsightIds: number[];
};

export const useActionItemsData = (filters: Record<string, string>) => {
  const [selectedActionItem, setSelectedActionItem] = useState<ActionItem | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Fetch action items data
  const fetchActionItemsData = async (): Promise<ActionItem[]> => {
    let query = supabase.from("action_items").select("*");

    // Apply filters if they exist
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        // For action items, we have to handle filtering differently
        // We'll filter related insights after fetching
        if (key !== "source" && key !== "segment" && key !== "sentiment") {
          query = query.eq(key, value);
        }
      }
    });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching action items data:", error);
      throw new Error("Failed to fetch action items data");
    }

    // Get related insights for each action item
    const actionItemsWithRelatedInsights = await Promise.all(
      (data || []).map(async (actionItem) => {
        const { data: relatedData, error: relatedError } = await supabase
          .from("actionitems_insights")
          .select("insight_key")
          .eq("actionitem_key", actionItem.actionitem_key);

        if (relatedError) {
          console.error("Error fetching related insights:", relatedError);
          return {
            id: actionItem.actionitem_key,
            title: actionItem.content?.split("\n")[0] || "No title",
            content: actionItem.content || "",
            sentiment: "neutral", // Default sentiment
            relatedInsightIds: [],
          };
        }

        return {
          id: actionItem.actionitem_key,
          title: actionItem.content?.split("\n")[0] || "No title",
          content: actionItem.content || "",
          sentiment: "neutral", // Default sentiment
          relatedInsightIds: relatedData?.map((item) => item.insight_key) || [],
        };
      })
    );

    return actionItemsWithRelatedInsights;
  };

  const {
    data: actionItems,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["actionItemsData", JSON.stringify(filters)],
    queryFn: fetchActionItemsData,
  });

  // Function to fetch related insights for a specific action item
  const fetchRelatedInsights = async (actionItemId: number) => {
    const { data, error } = await supabase
      .from("actionitems_insights")
      .select("insight_key")
      .eq("actionitem_key", actionItemId);

    if (error) {
      console.error("Error fetching related insights:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const insightIds = data.map((item) => item.insight_key);

    const { data: insightData, error: insightError } = await supabase
      .from("insights")
      .select("*")
      .in("insight_key", insightIds);

    if (insightError) {
      console.error("Error fetching insights:", insightError);
      return [];
    }

    return (insightData || []).map((item) => ({
      id: item.insight_key,
      title: item.content?.split("\n")[0] || "No title",
      content: item.content || "",
      sentiment: "neutral", // Default sentiment
    }));
  };

  return {
    actionItems: actionItems || [],
    isLoading,
    isError,
    refetch,
    selectedActionItem,
    setSelectedActionItem,
    fetchRelatedInsights,
    isFiltering,
    setIsFiltering,
  };
};
