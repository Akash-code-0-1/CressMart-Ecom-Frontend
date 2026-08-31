import { Label } from "./Label";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/utils/api";
import { useFormContext } from "react-hook-form";

const dropdownIcon =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M14.6134 15.614L18.0667 19.0673C18.1901 19.1909 18.3366 19.289 18.4979 19.3559C18.6592 19.4228 18.8321 19.4572 19.0067 19.4572C19.1813 19.4572 19.3542 19.4228 19.5155 19.3559C19.6768 19.289 19.8234 19.1909 19.9467 19.0673L23.4 15.614C24.2267 14.774 23.64 13.334 22.4534 13.334H15.56C14.36 13.334 13.7734 14.774 14.6134 15.614Z" fill="#969696"/></svg>`,
  );

export default function SidebarSupplierSection({
  isEditMode,
}: {
  isEditMode: boolean;
}) {
  const { setValue, watch } = useFormContext();
  const activeSuppliers = watch("supplier_ids") || [];
  const selectedSupplier = activeSuppliers[0] || "";

  const { data: supplierResponse } = useQuery({
    queryKey: ["suppliers-list-upload-select"],
    queryFn: async () => {
      const res = await apiFetch("/suppliers");
      return res.json();
    },
  });

  const supplierList = (() => {
    let list = [];
    if (Array.isArray(supplierResponse)) list = supplierResponse;
    else if (supplierResponse && Array.isArray(supplierResponse.data))
      list = supplierResponse.data;
    else if (supplierResponse && Array.isArray(supplierResponse.data?.data))
      list = supplierResponse.data.data;

    return list.filter(
      (s: { name: string; id: string; status: string }) =>
        s.status === "active" || !s.status,
    );
  })();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue("supplier_ids", value ? [value] : [], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="bg-white rounded-[8px] p-5 border border-gray-100 shadow-xs">
      <h3 className="text-[#003032] font-medium text-base mb-4">Suppliers</h3>
      <Label>Select Suppliers</Label>
      <select
        value={selectedSupplier}
        onChange={handleSelectChange}
        className="w-full appearance-none border-0 rounded-[6px] px-4 py-3.5 pr-8 text-sm text-black focus:outline-none cursor-pointer"
        style={{
          backgroundColor: "#F9F9F9",
          backgroundImage: `url("${dropdownIcon}")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 8px center",
          backgroundSize: "20px 20px",
        }}
      >
        <option value="">Select Supplier*</option>
        {supplierList.map(
          (supplier: { name: string; id: string; status: string }) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ),
        )}
      </select>
      {supplierList.length === 0 && (
        <span className="text-[12px] text-gray-400">No suppliers found.</span>
      )}
    </div>
  );
}
