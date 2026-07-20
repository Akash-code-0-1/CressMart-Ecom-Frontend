// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { RotateCcw, Plus, User } from "lucide-react";
// import CrystalOrangeButton from "./CrystalOrangeButton";
// import { LogoUploadCard } from "./LogoUploadCard";
// import { RichTextSection } from "./RichTextSection";
// import TabItem from "../catalog/TabItem";
// import ContentIcon from "@/components/store-front/svg/svg/ContentIcon";
// import ChatInterfaceIcon from "@/components/store-front/svg/svg/ChatInterfaceIcon";
// import ShopSettingsIcon from "@/components/store-front/svg/svg/ShopSettingsIcon";
// import PrimaryButton from "../common/PrimaryButton";

// const InputGroup = ({
//   label,
//   placeholder,
//   type = "text",
// }: {
//   label: string;
//   placeholder: string;
//   type?: string;
// }) => (
//   <div className="flex flex-col gap-3 w-full">
//     <label className="text-[15px] font-bold text-[#000000] font-lato">
//       {label}
//     </label>
//     <input
//       type={type}
//       placeholder={placeholder}
//       className="bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-base outline-none placeholder:text-[#A2A2A2] border-none font-poppins"
//     />
//   </div>
// );

// export default function SettingsPage() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const tabs = [
//     {
//       id: "web",
//       label: "Website Information",
//       icon: ContentIcon,
//       path: "/admin/dashboard/settings/information",
//     },
//     {
//       id: "chat",
//       label: "Chat Settings",
//       icon: ChatInterfaceIcon,
//       path: "/admin/dashboard/settings/chat",
//     },
//     {
//       id: "shop",
//       label: "Manage Shop",
//       icon: ShopSettingsIcon,
//       path: "/admin/dashboard/settings/shop",
//     },
//     {
//       id: "profile",
//       label: "Profile Details",
//       icon: User,
//       path: "/admin/dashboard/settings/profile",
//     },
//   ];

//   return (
//     <div className="w-full bg-white p-8 font-lato">
//       <h1 className="text-2xl font-bold text-[#003032] mb-6">Settings</h1>
//       {/* Tabs Navigation */}
//       <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none">
//         {tabs.map((tab) => (
//           <TabItem
//             key={tab.id}
//             label={tab.label}
//             icon={tab.icon}
//             isActive={pathname === tab.path}
//             onClick={() => router.push(tab.path)}
//           />
//         ))}
//       </div>
//       {/* Header Row */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//         <h2 className="text-xl font-bold text-[#003032]">
//           Website Information
//         </h2>
//         <div className="flex items-center gap-3 w-full sm:w-auto">
//           <button
//             className="cursor-pointer flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-[8px]
//     bg-[#F9F9F9] text-[#020202] font-semibold text-sm sm:text-base whitespace-nowrap transition-colors"
//           >
//             <RotateCcw size={18} /> Reset
//           </button>
//           <PrimaryButton
//             label="Save Changes"
//             className="flex-1 sm:flex-initial text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
//           />
//         </div>
//       </div>

//       {/* Logo Section */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//         <LogoUploadCard
//           title="Primary Store Logo (Fallback)"
//           imgSrc="/images/logo.png"
//         />
//         <LogoUploadCard
//           title="Header Logo Override"
//           imgSrc="/images/logo.png"
//         />
//         <LogoUploadCard
//           title="Footer Logo Override"
//           imgSrc="/images/logo.png"
//         />
//         <LogoUploadCard title="Favicon (32x32 px)" imgSrc="/images/logo.png" />
//       </div>

//       {/* Basic Forms Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 mb-10">
//         <InputGroup label="Announcement" placeholder="Text" />
//         <InputGroup label="Email" placeholder="xyz@gmail.com" />
//         <InputGroup label="Branding Text" placeholder="Your Brand Text" />
//         <InputGroup label="Address" placeholder="Your Address" />
//         <InputGroup label="Facebook" placeholder="Facebook link" />
//         <InputGroup label="Massager" placeholder="Massager Link" />
//         <InputGroup label="Instagram" placeholder="Instagram Link" />
//         <InputGroup label="TikTok" placeholder="TikTok Text" />
//         <InputGroup label="Social Link" placeholder="Social Link" />
//         <div className="flex items-end">
//           <CrystalOrangeButton
//             label="Add New Link"
//             icon={<Plus size={20} strokeWidth={3} />}
//             className="w-full"
//           />
//         </div>
//       </div>

//       {/* Settings Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-12 mb-12">
//         {/* Country Settings */}
//         <section>
//           <h3 className="text-[22px] font-bold text-black mb-6">
//             Country Settings
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <InputGroup label="Shop Country" placeholder="Bangladesh (BD)" />
//             <InputGroup label="Shop Currency" placeholder="Taka-BDT (৳)" />
//           </div>
//         </section>
//         {/* Social Login */}
//         <section>
//           <h3 className="text-[22px] font-bold text-[#000000] mb-6">
//             Social Login
//           </h3>
//           <div className="flex flex-col gap-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <InputGroup label="Login Type" placeholder="Google" />
//               <InputGroup
//                 label="Auth/Client ID"
//                 placeholder="531559968835-..."
//               />
//             </div>
//             <CrystalOrangeButton
//               label="Add New"
//               icon={<Plus size={18} strokeWidth={3} />}
//               className="w-fit px-6"
//             />
//           </div>
//         </section>
//         {/* Offer Section */}
//         <section>
//           <h3 className="text-[22px] font-bold text-[#000000] mb-6">Offer</h3>
//           <div className="flex flex-col gap-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <InputGroup label="Offer Type" placeholder="Registration" />
//               <InputGroup label="Discount" placeholder="Ex: 1000 or 20%" />
//             </div>
//             <CrystalOrangeButton
//               label="Add New"
//               icon={<Plus size={18} strokeWidth={3} />}
//               className="w-fit px-6"
//             />
//           </div>
//         </section>
//       </div>

//       {/* Rich Text Areas */}
//       <RichTextSection title="About us" placeholder="About Your Brand" />
//       <RichTextSection
//         title="Privacy Policy"
//         placeholder="Shop Privacy And Policy"
//       />
//       <RichTextSection
//         title="Terms and Condition"
//         placeholder="Shop Terms And Conditions"
//       />
//       <RichTextSection
//         title="Return and Cancellation Policy"
//         placeholder="Return and Cancellation Policy"
//       />

//       {/* Footer Settings Area */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 pt-10">
//         <div className="flex flex-col gap-4">
//           {[
//             {
//               t: "Footer Quick Links",
//               s: "Shown in the Quick Links column of Footer 2",
//             },
//             {
//               t: "Footer Useful Links",
//               s: "Shown in the useful Links column of Footer 3",
//             },
//           ].map((f, i) => (
//             <div
//               key={i}
//               className="bg-[#F9F9F9] p-4 rounded-[8px] flex justify-between items-center"
//             >
//               <div>
//                 <p className="text-sm font-medium text-black font-poppins">
//                   {f.t}
//                 </p>
//                 <p className="text-[10px] text-[#B9B9B9] font-noraml font-poppins">
//                   {f.s}
//                 </p>
//               </div>
//               <PrimaryButton label="Add Link" className="px-3 py-2 text-xs" />
//             </div>
//           ))}
//         </div>

//         <div className="flex flex-col gap-4">
//           <h4 className="text-sm font-semibold text-black font-poppins">
//             Footer Section Settings
//           </h4>
//           {[
//             "Is show new slider",
//             "Hide copyright section",
//             "Hide copyright text",
//             "Powered by System Next IT",
//           ].map((item, i) => (
//             <label key={i} className="flex items-center gap-3 cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="w-5 h-5 rounded-[4px] border-gray-300 accent-[#1DA1F2]"
//               />
//               <span className="text-xs font-medium text-[#1D1A1A] font-poppins">
//                 {item}
//               </span>
//             </label>
//           ))}
//         </div>

//         <div className="flex flex-col gap-4">
//           <h4 className="text-sm font-semibold text-black font-poppins">
//             Product Settings
//           </h4>
//           {[
//             "Show Product Sold Count",
//             "Allow Product Image Downloads",
//             "Show Email Field for Place Order",
//             "Enable Promo Code for Place Order",
//           ].map((item, i) => (
//             <label key={i} className="flex items-center gap-3 cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="w-5 h-5 rounded-[4px] border-gray-300 accent-[#1DA1F2]"
//               />
//               <span className="text-xs font-medium text-[#1D1A1A] font-poppins">
//                 {item}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSettings, updateSettings } from "@/services-api/settingsService";
import { RotateCcw, Plus, User, Trash2 } from "lucide-react";

// Components
import CrystalOrangeButton from "./CrystalOrangeButton";
import { LogoUploadCard } from "./LogoUploadCard";
import { RichTextSection } from "./RichTextSection";
import TabItem from "../catalog/TabItem";
import ContentIcon from "@/components/store-front/svg/svg/ContentIcon";
import ChatInterfaceIcon from "@/components/store-front/svg/svg/ChatInterfaceIcon";
import ShopSettingsIcon from "@/components/store-front/svg/svg/ShopSettingsIcon";
import PrimaryButton from "../common/PrimaryButton";

const InputGroup = ({ label, name, placeholder, type = "text" }: any) => {
  const { register } = useFormContext();
  return (
    <div className="flex flex-col gap-3 w-full">
      <label className="text-[15px] font-bold text-[#000000] font-lato">
        {label}
      </label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-base outline-none placeholder:text-[#A2A2A2] border-none font-poppins"
      />
    </div>
  );
};

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const methods = useForm<any>({
    defaultValues: {
      social_links: [],
      offers: [],
      chat_support: {},
      site_toggles: {},
    },
  });
  const { handleSubmit, reset, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "social_links",
  });
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      alert("Settings saved!");
    },
  });

  useEffect(() => {
    if (settings) {
      // Look at your screenshot: the actual data is inside "data"
      const settingsData = settings.data || settings;

      console.log("Resetting form with:", settingsData);
      reset(settingsData);
    }
  }, [settings, reset]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="w-full bg-white p-8 font-lato"
      >
        <h1 className="text-2xl font-bold text-[#003032] mb-6">Settings</h1>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none">
          {[
            {
              id: "web",
              label: "Website Information",
              icon: ContentIcon,
              path: "/admin/dashboard/settings/information",
            },
            {
              id: "chat",
              label: "Chat Settings",
              icon: ChatInterfaceIcon,
              path: "/admin/dashboard/settings/chat",
            },
            {
              id: "shop",
              label: "Manage Shop",
              icon: ShopSettingsIcon,
              path: "/admin/dashboard/settings/shop",
            },
            {
              id: "profile",
              label: "Profile Details",
              icon: User,
              path: "/admin/dashboard/settings/profile",
            },
          ].map((tab) => (
            <TabItem
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={pathname === tab.path}
              onClick={() => router.push(tab.path)}
            />
          ))}
        </div>

        {/* Header Row */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-[#003032]">
            Website Information
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="flex items-center gap-2 px-6 py-3 rounded-[8px] bg-[#F9F9F9] text-sm font-semibold"
            >
              {/* <RotateCcw size={18} /> Reset */}
            </button>
            <PrimaryButton
              label={mutation.isPending ? "Saving..." : "Save Changes"}
              type="submit"
            />
          </div>
        </div>

        {/* Logo Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Controller
            name="primary_logo"
            render={({ field: { onChange, value } }) => (
              <LogoUploadCard
                title="Primary Logo"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="header_logo"
            render={({ field: { onChange, value } }) => (
              <LogoUploadCard
                title="Header Logo"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="footer_logo"
            render={({ field: { onChange, value } }) => (
              <LogoUploadCard
                title="Footer Logo"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="favicon"
            render={({ field: { onChange, value } }) => (
              <LogoUploadCard
                title="Favicon"
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>

        {/* Basic Forms Section */}
        <div className="flex flex-col gap-6 mb-10">
          {/* The first 4 inputs in a 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <InputGroup
              label="Announcement"
              name="announcement"
              placeholder="Text"
            />
            <InputGroup
              label="Email"
              name="contact_email"
              placeholder="xyz@gmail.com"
            />
            <InputGroup
              label="Branding Text"
              name="branding_text"
              placeholder="Your Brand Text"
            />
            <InputGroup
              label="Address"
              name="address"
              placeholder="Your Address"
            />
          </div>

          {/* Social Links Section - Full Width */}
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="text-[15px] font-bold text-[#000000] font-lato">
              Social Links
            </h3>

            {fields.map((f: any, i) => (
              <div
                key={f.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
              >
                <div className="md:col-span-5">
                  <InputGroup
                    name={`social_links.${i}.platform`}
                    label=""
                    placeholder="Platform"
                  />
                </div>
                <div className="md:col-span-5">
                  <InputGroup
                    name={`social_links.${i}.url`}
                    label=""
                    placeholder="URL"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="w-full h-[48px] flex items-center justify-center bg-[#FFF1F1] text-[#FF4D4D] rounded-[8px] hover:bg-[#ffe0e0] transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-2">
              <CrystalOrangeButton
                label="Add New Link"
                type="button"
                icon={<Plus size={20} />}
                onClick={() => append({ platform: "", url: "" })}
              />
            </div>
          </div>
        </div>

        {/* Country & Settings Grid */}
        <div className="grid grid-cols-1 gap-12 mb-12">
          <section>
            <h3 className="text-[22px] font-bold mb-6">Country Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label="Shop Country"
                name="shop_country"
                placeholder="Bangladesh (BD)"
              />
              <InputGroup
                label="Shop Currency"
                name="shop_currency"
                placeholder="Taka-BDT (৳)"
              />
            </div>
          </section>
        </div>

        {/* Rich Text Areas */}
        <RichTextSection
          title="About us"
          name="about_content"
          placeholder="About Your Brand"
        />
        <RichTextSection
          title="Privacy Policy"
          name="privacy_content"
          placeholder="Shop Privacy And Policy"
        />
        <RichTextSection
          title="Terms and Condition"
          name="terms_content"
          placeholder="Shop Terms And Conditions"
        />
        <RichTextSection
          title="Return and Cancellation Policy"
          name="return_content"
          placeholder="Return and Cancellation Policy"
        />
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 pt-10">
        <div className="flex flex-col gap-4">
          {[
            {
              t: "Footer Quick Links",
              s: "Shown in the Quick Links column of Footer 2",
            },
            {
              t: "Footer Useful Links",
              s: "Shown in the useful Links column of Footer 3",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#F9F9F9] p-4 rounded-[8px] flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-black font-poppins">
                  {f.t}
                </p>
                <p className="text-[10px] text-[#B9B9B9] font-noraml font-poppins">
                  {f.s}
                </p>
              </div>
              <PrimaryButton label="Add Link" className="px-3 py-2 text-xs" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold text-black font-poppins">
            Footer Section Settings
          </h4>
          {[
            "Is show new slider",
            "Hide copyright section",
            "Hide copyright text",
            "Powered by System Next IT",
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-[4px] border-gray-300 accent-[#1DA1F2]"
              />
              <span className="text-xs font-medium text-[#1D1A1A] font-poppins">
                {item}
              </span>
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold text-black font-poppins">
            Product Settings
          </h4>
          {[
            "Show Product Sold Count",
            "Allow Product Image Downloads",
            "Show Email Field for Place Order",
            "Enable Promo Code for Place Order",
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-[4px] border-gray-300 accent-[#1DA1F2]"
              />
              <span className="text-xs font-medium text-[#1D1A1A] font-poppins">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </FormProvider>
  );
}
