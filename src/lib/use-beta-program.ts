import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBetaProgramStatus } from "@/lib/beta.functions";

export const BETA_PROGRAM_QUERY_KEY = ["beta-program-status"] as const;

export function useBetaProgram() {
  return useQuery({
    queryKey: BETA_PROGRAM_QUERY_KEY,
    queryFn: () => getBetaProgramStatus(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useInvalidateBetaProgram() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: BETA_PROGRAM_QUERY_KEY });
}
