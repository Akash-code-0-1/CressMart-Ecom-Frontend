import { Banner } from "@/services-api/bannerService";
import { LocalBanner } from "@/components/admin/content/carousel/caurousel.typ";

export const TITLE_LIMIT = 60;
export const DESCRIPTION_LIMIT = 160;

export const EMPTY_FORM: Banner = {
  image_url: [],
  link_url: "",
  meta_title: "",
  meta_tags: "",
  meta_description: "",
  status: "draft",
  position: 1,
};

export const isBlobUrl = (url: string): boolean => url.startsWith("blob:");

export const getBannerKey = (banner: LocalBanner): string =>
  banner.id ?? banner._tempId ?? "";

export const resolveImgSrc = (
  path: string | undefined | null,
  backendBaseUrl: string,
): string => {
  if (!path) return "";
  return path.startsWith("http") || isBlobUrl(path)
    ? path
    : `${backendBaseUrl}/${path.replace(/^\/+/, "")}`;
};

// Returns a plain Banner payload safe to send to the API, without the
// client-only _tempId field. Copy + delete avoids unused-destructure lint
// warnings you'd get from `const { _tempId, ...rest } = banner`.
export const stripTempId = (banner: LocalBanner): Banner => {
  const payload: LocalBanner = { ...banner };
  delete payload._tempId;
  return payload;
};

export const omitKey = <T>(
  record: Record<string, T>,
  key: string,
): Record<string, T> => {
  const next = { ...record };
  delete next[key];
  return next;
};
