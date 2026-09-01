import { SectionWrapper } from "./SectionWrapper";
import { CirclePlus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
        checked ? "bg-[#3B82F6]" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function ShippingSection({
  isEditMode,
}: {
  isEditMode: boolean;
}) {
  const { control, watch, setValue, register } = useFormContext();
  const shippingMode = watch("shippingMode") as "DEFAULT" | "CUSTOM" | "FREE";

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customShippingRows",
  });

  const applyDefault = shippingMode === "DEFAULT";
  const isFree = shippingMode === "FREE";
  const isCustom = shippingMode === "CUSTOM";

  const handleApplyDefaultToggle = (val: boolean) => {
    if (val) {
      // Turn DEFAULT on — clear any stale CUSTOM rows from UI (backend won't store them)
      setValue("shippingMode", "DEFAULT");
    } else {
      // Switch to CUSTOM so user can start adding zone rows
      setValue("shippingMode", "CUSTOM");
    }
  };

  const handleFreeToggle = (val: boolean) => {
    setValue("shippingMode", val ? "FREE" : "DEFAULT");
  };

  const handleAddRow = () => {
    // Auto-switch to CUSTOM when user clicks "Add Specific Zone"
    if (shippingMode !== "CUSTOM") {
      setValue("shippingMode", "CUSTOM");
    }
    append({ zone: "", charge: "" });
  };

  return (
    <SectionWrapper title="Shipping" description="">
      <div className="bg-white rounded-xl p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Delivery Charge
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Choose how delivery charges apply to this product.
          </p>
        </div>

        {/* ── Toggle: Apply default delivery charges ── */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-800">
              Apply default delivery charges
            </span>
            <p className="text-xs text-gray-400 mt-0.5">
              Uses your global shipping zone rates at checkout
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              [{applyDefault ? "Applied" : "Not Applied"}]
            </span>
            <ToggleSwitch
              checked={applyDefault}
              onChange={handleApplyDefaultToggle}
            />
          </div>
        </div>

        {/* DEFAULT info banner */}
        {applyDefault && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-2.5 rounded-[8px]">
            ✓ This product will use the global delivery rates set in Settings →
            Delivery Charge.
          </div>
        )}

        {/* ── Toggle: Free delivery ── */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-800">
              Free delivery charge
            </span>
            <p className="text-xs text-gray-400 mt-0.5">
              No shipping fee will be charged for this product
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              [{isFree ? "Applied" : "Not Applied"}]
            </span>
            <ToggleSwitch checked={isFree} onChange={handleFreeToggle} />
          </div>
        </div>

        {/* FREE info banner */}
        {isFree && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2.5 rounded-[8px]">
            ✓ This product will ship free of charge to all zones (৳0).
          </div>
        )}

        {/* ── CUSTOM: Specific Delivery Charge rows ── */}
        {!isFree && (
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Specific Delivery Charge
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Add zone-specific rates — overrides global rates for this
                  product
                </p>
              </div>
              {isCustom && (
                <span className="text-[10px] bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2">
                  CUSTOM MODE
                </span>
              )}
            </div>

            {/* Zone rows — visible only in CUSTOM mode */}
            {isCustom && (
              <div className="space-y-2 mt-3">
                {fields.length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    No zones added yet. Click &quot;Add Specific Zone&quot; below.
                  </p>
                )}
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      {...register(`customShippingRows.${idx}.zone`)}
                      placeholder="Zone (e.g. Dhaka, Chittagong, Sylhet)"
                      className="flex-1 bg-[#F9F9F9] px-3 py-3 text-xs rounded-[8px] outline-none border border-transparent focus:border-gray-200 transition-all"
                    />
                    <input
                      type="number"
                      min="0"
                      {...register(`customShippingRows.${idx}.charge`)}
                      placeholder="Charge (৳)"
                      className="w-32 bg-[#F9F9F9] px-3 py-3 text-xs rounded-[8px] outline-none border border-transparent focus:border-gray-200 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-red-400 hover:text-red-600 shrink-0 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Specific Zone button — auto-enables CUSTOM mode */}
            <button
              type="button"
              onClick={handleAddRow}
              className="mt-3 flex items-center gap-2 border border-dashed border-gray-300 rounded-[8px] px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <CirclePlus size={20} />
              Add Specific Zone
            </button>

            {!isCustom && (
              <p className="text-xs text-gray-400 mt-1.5">
                Clicking &quot;Add Specific Zone&quot; will automatically switch to Custom
                mode.
              </p>
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
