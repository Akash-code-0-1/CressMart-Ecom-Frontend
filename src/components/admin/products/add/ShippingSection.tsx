
import { Toggle } from './Toggle'
import { Label } from './Label'
import { Input } from './Input'

export default function ShippingSection() {
    return (
        <div className="mb-12">

            <div className="mb-6">
                <h4 className="text-[20px] font-medium text-black mb-1">Delivery Charge</h4>
                <p className="text-[12px] text-[#A2A2A2] leading-tight">
                    You can add specific delivery charge for this product or use the default charges
                </p>
            </div>

            <div className="flex justify-between items-center mb-8">
                <span className="text-base font-normal text-[#000000]">Apply default delivery charges</span>
                <div className="flex items-center gap-3">
                    <span className="text-base font-normal text-[#000000]">[Not Applied]</span>
                    <Toggle checked={false} />
                </div>
            </div>


            <div className="mb-8">
                <Label>Delivery Charge (Default)</Label>
                <Input placeholder='120' />
            </div>

            <div className="mb-12">
                <Label>Specific Delivery Charge</Label>
                <div className="flex gap-4">
                    <div className="flex-[2]">
                        <Input placeholder='60' />
                    </div>
                    <div className="flex-[1]">
                        <Input placeholder='80' />
                    </div>
                </div>
            </div>
        </div>
    )
}
