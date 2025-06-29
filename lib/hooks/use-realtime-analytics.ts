"use client";

import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { AnalyticsAPI } from '@/lib/database';

export interface RealtimeAnalyticsHook {
  trackProductView: (productId: string, productName: string, productBrand: string, category: string, price: number, source?: string) => Promise<void>;
  trackSearch: (query: string, category?: string, resultsCount?: number, clickedProductId?: string) => Promise<void>;
  trackChatInteraction: (query: string, responseType: string, productsFound: number) => Promise<void>;
}

export function useRealtimeAnalytics(): RealtimeAnalyticsHook {
  const { user } = useAuth();

  const trackProductView = useCallback(async (
    productId: string,
    productName: string,
    productBrand: string,
    category: string,
    price: number,
    source: string = 'ai_generated'
  ) => {
    if (!user) return;

    try {
      await AnalyticsAPI.trackProductView({
        user_id: user.id,
        product_id: productId,
        product_name: productName,
        product_brand: productBrand,
        category,
        price,
        source
      });
    } catch (error) {
      console.error('Failed to track product view:', error);
    }
  }, [user]);

  const trackSearch = useCallback(async (
    query: string,
    category?: string,
    resultsCount: number = 0,
    clickedProductId?: string
  ) => {
    if (!user) return;

    try {
      await AnalyticsAPI.trackSearch({
        user_id: user.id,
        query,
        category,
        results_count: resultsCount,
        clicked_product_id: clickedProductId
      });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  }, [user]);

  const trackChatInteraction = useCallback(async (
    query: string,
    responseType: string,
    productsFound: number
  ) => {
    if (!user) return;

    try {
      // Track as a search with additional metadata
      await AnalyticsAPI.trackSearch({
        user_id: user.id,
        query,
        category: responseType,
        results_count: productsFound
      });
    } catch (error) {
      console.error('Failed to track chat interaction:', error);
    }
  }, [user]);

  return {
    trackProductView,
    trackSearch,
    trackChatInteraction
  };
}