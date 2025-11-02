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

  const fn = async (...args: TArgs) => {
    setLoading(true);
    setError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = (await cb(...args)) as any;
      setData(response);
      setError(null);
    } catch (error) {
      console.error('Error in useFetch:', error);
      setError(error as Error);
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;