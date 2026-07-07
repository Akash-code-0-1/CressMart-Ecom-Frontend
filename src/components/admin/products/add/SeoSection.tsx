import React from 'react'
import { Label } from './Label'
import { Input } from './Input'

export default function SeoSection() {
    return (
        <div className="mb-12 bg-white px-4 py-5 rounded-[8px]">
            <h3 className="text-[20px] font-medium text-black mb-8">SEO Info</h3>

            <div className="flex flex-col gap-8">
                <div>
                    <Label>Keyword</Label>
                    <Input placeholder="Seo Keyword" />
                </div>

                <div>
                    <Label>SEO Description</Label>
                    <Input placeholder="Seo Description" />
                </div>

                <div>
                    <Label>SEO Title</Label>
                    <Input placeholder="Seo Title" />
                </div>
            </div>
        </div>
    )
}
