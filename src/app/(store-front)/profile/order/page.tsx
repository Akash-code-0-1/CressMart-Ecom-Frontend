"use client";
import { FiHeadphones } from "react-icons/fi";
import { BsDot } from "react-icons/bs";
import StatusBadge from "@/components/store-front/profile/StatusBadge";

const ordersData = [
  {
    id: "#OR1250",
    product: "Wireless Bluetooth Headphones",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    status: "Pending",
  },
  {
    id: "#OR1250",
    product: "Wireless Bluetooth Headphones",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#OR1250",
    product: "Wireless Bluetooth Headphones",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    status: "Canceled",
  },
  {
    id: "#OR1250",
    product: "Wireless Bluetooth Headphones",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    status: "Canceled",
  },
  {
    id: "#OR1250",
    product: "Wireless Bluetooth Headphones",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    status: "Pending",
  },
];

const Page = () => {
  return (
    <div className="bg-white rounded-[12px] border border-[#D2D2D2] overflow-hidden font-poppins">
      {/* Header Section */}
      <div className="p-6 border-b border-[#F2F2F2]">
        <h2 className="text-[20px] font-semibold text-black">Orders</h2>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-[#727272] text-[14px] font-medium border-b border-[#F2F2F2]">
              <th className="p-5 pl-8">No.</th>
              <th className="p-5">Order Id</th>
              <th className="p-5">Product</th>
              <th className="p-5">Date</th>
              <th className="p-5">Price</th>
              <th className="p-5">Payment</th>
              <th className="p-5">Status</th>
            </tr>
          </thead>
          <tbody className="text-[14px] text-[#4D4D4D]">
            {ordersData.map((order, index) => (
              <tr
                key={index}
                className="border-b border-[#F9F9F9] hover:bg-[#FF7050]/5 transition-all group"
              >
                <td className="p-5 pl-8">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-[#727272]">
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="p-5 font-semibold text-black">{order.id}</td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white border border-[#FF7050] rounded-full flex items-center justify-center text-[#FF7050] shadow-sm">
                      <FiHeadphones size={18} />
                    </div>
                    <span className="font-medium text-black truncate max-w-[200px]">
                      {order.product}
                    </span>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="font-medium text-black">{order.date}</span>
                    <span className="text-[11px] text-[#727272]">
                      {order.time}
                    </span>
                  </div>
                </td>
                <td className="p-5 font-bold text-black">${order.price}</td>
                <td className="p-5">
                  <div className="flex items-center gap-0">
                    <BsDot
                      size={28}
                      className={
                        order.payment === "Paid"
                          ? "text-[#32CD32]"
                          : "text-[#FF7050]"
                      }
                    />
                    <span className="font-medium">{order.payment}</span>
                  </div>
                </td>
                <td className="p-5">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
