import { Input } from "./Input";
import { Label } from "./Label";
import { SectionWrapper } from "./SectionWrapper";


export default function InventorySection({ Barcode, Calendar }: any) {
    return (
        <SectionWrapper title="Inventory">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-6">
                <div><Label>Product Priority</Label><Input placeholder="0%" /></div>
                <div><Label>Quantity (Stock)</Label><Input placeholder="50" /></div>
                <div><Label>Unit Name</Label><Input placeholder="Piece, kg, liter, meter etc." /></div>
                <div><Label>Warranty</Label><Input placeholder="12 month" /></div>
                <div><Label>SKU / Product Code</Label><Input placeholder="ABC-XYZ-123" /></div>
                <div><Label>Bar Code</Label><Input placeholder="2154645786216" icon={Barcode} /></div>
                <div><Label>Initial Sold Count</Label><Input placeholder="0" /></div>
                <div><Label>Production Start</Label><Input placeholder="DD-MM-YYYY" icon={Calendar} /></div>
                <div><Label>Expiration End</Label><Input placeholder="DD-MM-YYYY" icon={Calendar} /></div>
            </div>
        </SectionWrapper>
    )
}
