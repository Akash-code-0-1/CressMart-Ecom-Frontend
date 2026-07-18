import { Banner } from "@/services-api/bannerService";

// Local-only field used to track banners that have not been persisted yet.
// Never sent to the backend.
export type LocalBanner = Banner & { _tempId?: string };
