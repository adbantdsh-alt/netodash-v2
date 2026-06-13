import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActiveMode, type BusinessMode } from "@/lib/use-active-mode";
import type { Product, DailyEntry } from "./calc";

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useProducts(userId: string | undefined, modeOverride?: BusinessMode) {
  const { mode: activeMode } = useActiveMode();
  const mode = modeOverride ?? activeMode;
  return useQuery({
    queryKey: ["products", userId, mode],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("business_mode" as any, mode)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as (Product & { active: boolean; created_at: string })[];
    },
  });
}

export function useEntries(
  userId: string | undefined,
  range: { from: string; to: string },
  productId?: string,
  modeOverride?: BusinessMode,
) {
  const { mode: activeMode } = useActiveMode();
  const mode = modeOverride ?? activeMode;
  return useQuery({
    queryKey: ["entries", userId, range.from, range.to, productId ?? "all", mode],
    enabled: !!userId,
    queryFn: async () => {
      let q = supabase
        .from("daily_entries")
        .select("*")
        .eq("business_mode" as any, mode)
        .gte("entry_date", range.from)
        .lte("entry_date", range.to)
        .order("entry_date", { ascending: false });
      if (productId) q = q.eq("product_id", productId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as DailyEntry[];
    },
  });
}

export function useCreatives(userId: string | undefined, productId?: string) {
  return useQuery({
    queryKey: ["creatives", userId, productId ?? "all"],
    enabled: !!userId,
    queryFn: async () => {
      let q = supabase.from("creatives").select("*").order("created_at", { ascending: false });
      if (productId) q = q.eq("product_id", productId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreativePerformance(
  userId: string | undefined,
  range: { from: string; to: string },
) {
  return useQuery({
    queryKey: ["creative_perf", userId, range.from, range.to],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creative_performance")
        .select("*")
        .gte("entry_date", range.from)
        .lte("entry_date", range.to);
      if (error) throw error;
      return data ?? [];
    },
  });
}
