import { useUpgradeModal } from "@/contexts/ModalContext";
import { useState } from "react";
import { toast } from "sonner";

type AsyncFn<TArgs extends unknown[]> = (...args: TArgs) => Promise<unknown>;

function useFetch<TArgs extends unknown[] = unknown[]>(
  cb: AsyncFn<TArgs>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { open } = useUpgradeModal();
  const fn = async (...args: TArgs) => {
    setLoading(true);
    setError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = (await cb(...args)) as any;

      if (!response.success && response?.error === 'OUT_OF_BALANCE') {
        open();
        toast.error("Insufficient credit balance. Please upgrade your plan.");
        return;
      }
      setData(response);
      setError(null);
    } catch (error) {
      setError(error as Error);
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;