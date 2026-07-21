import CampaignTable from "@/components/admin/campaign/CampaignTable";

export default function Page() {
  return (
    <div className="flex overflow-hidden">
      <main className="w-full mt-4">
        <CampaignTable />
      </main>
    </div>
  );
}
