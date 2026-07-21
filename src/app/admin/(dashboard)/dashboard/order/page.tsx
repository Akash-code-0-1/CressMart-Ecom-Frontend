import OrderHeader from "@/components/admin/order/OrderHeader";
import OrderTable from "@/components/admin/order/OrderTable";

export default function Page() {
  return (
    <div className="flex h-screen overflow-hidden">
      <main className="flex-1 overflow-y-auto focus:outline-none">
        <div className="p-2 md:p-0">
          <div className="mt-2">
            <OrderHeader />
          </div>
          {/* <OrderSummery /> */}
          <div className="mx-2 md:mx-4">
            <OrderTable />
          </div>
        </div>
      </main>
    </div>
  );
}
