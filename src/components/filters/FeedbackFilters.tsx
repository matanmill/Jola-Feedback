
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Filter } from 'lucide-react';

export interface FilterOptions {
  sources: string[];
  segments: string[];
  sentiments: string[];
}

interface FeedbackFiltersProps {
  options: FilterOptions;
  onFilterChange: (type: 'source' | 'segment' | 'sentiment', value: string | null) => void;
  selectedSource: string | null;
  selectedSegment: string | null;
  selectedSentiment: string | null;
}

const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
  options,
  onFilterChange,
  selectedSource,
  selectedSegment,
  selectedSentiment
}) => {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-500">Filter:</span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            <span>
              {selectedSource || selectedSegment || selectedSentiment 
                ? 'Filtered' 
                : 'All Items'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {/* Source Filter */}
          <DropdownMenuLabel>Source</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem 
              onClick={() => onFilterChange('source', null)}
              className="flex items-center justify-between"
            >
              All Sources
              {selectedSource === null && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            {options.sources.map(source => (
              <DropdownMenuItem 
                key={`source-${source}`} 
                onClick={() => onFilterChange('source', source)}
                className="flex items-center justify-between"
              >
                {source}
                {selectedSource === source && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          {/* Segment Filter */}
          <DropdownMenuLabel>Segment</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem 
              onClick={() => onFilterChange('segment', null)}
              className="flex items-center justify-between"
            >
              All Segments
              {selectedSegment === null && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            {options.segments.map(segment => (
              <DropdownMenuItem 
                key={`segment-${segment}`} 
                onClick={() => onFilterChange('segment', segment)}
                className="flex items-center justify-between"
              >
                {segment}
                {selectedSegment === segment && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          {/* Sentiment Filter */}
          <DropdownMenuLabel>Sentiment</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem 
              onClick={() => onFilterChange('sentiment', null)}
              className="flex items-center justify-between"
            >
              All Sentiments
              {selectedSentiment === null && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            {options.sentiments.map(sentiment => (
              <DropdownMenuItem 
                key={`sentiment-${sentiment}`} 
                onClick={() => onFilterChange('sentiment', sentiment)}
                className="flex items-center justify-between"
              >
                {sentiment}
                {selectedSentiment === sentiment && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Reset button if any filter is active */}
      {(selectedSource || selectedSegment || selectedSentiment) && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs"
          onClick={() => {
            onFilterChange('source', null);
            onFilterChange('segment', null);
            onFilterChange('sentiment', null);
          }}
        >
          Reset
        </Button>
      )}
    </div>
  );
};

export default FeedbackFilters;
