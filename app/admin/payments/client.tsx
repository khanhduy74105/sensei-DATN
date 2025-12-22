"use client";

import { PaymentRow } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle, X, Coins } from "lucide-react";

export default function AdminPaymentsClient({
  payments,
  currentPage,
}: {
  payments: PaymentRow[];
  currentPage: number;
}) {
  const router = useRouter();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Payments & Credits</h2>
          <p className="text-gray-400">Manage user payments and credits</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">User Email</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Name</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Balance</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Created</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {payments?.length ? (
              payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-800 transition-colors duration-150"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {payment.userEmail}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {payment.userName || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center">
                      {payment.isPaid ? (
                        <span className="flex items-center gap-1 text-green-500 text-sm font-medium">
                          <CheckCircle size={16} />
                          Paid
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                          <X size={16} />
                          Free
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="flex items-center justify-center gap-1 font-semibold">
                      <Coins size={16} className="text-yellow-500" />
                      {payment.balance}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                    {new Date(payment.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-6 text-gray-400 font-medium"
                >
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() =>
            router.replace(`/admin/payments?page=${currentPage - 1}`)
          }
        >
          Previous
        </Button>
        <span className="text-gray-300 font-medium">Page {currentPage}</span>
        <Button
          variant="outline"
          disabled={(payments?.length ?? 0) < 20}
          onClick={() =>
            router.replace(`/admin/payments?page=${currentPage + 1}`)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}