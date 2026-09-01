"use client";

import { useEffect } from "react";
import Script from "next/script";

interface PublicMarketingSettings {
  sitemapEnabled?: boolean;
  gtmId?: string;
  googleVerificationCode?: string;
  fbPixelId?: string;
  fbPixelTestEventId?: string;
  fbDomainVerificationCode?: string;
  tiktokPixelId?: string;
  tiktokTestEventId?: string;
  baseScript?: string;
}

interface MarketingScriptsProps {
  initialSettings?: PublicMarketingSettings | null;
}

export default function MarketingScripts({
  initialSettings,
}: MarketingScriptsProps) {
  useEffect(() => {
    if (!initialSettings) return;

    // 1. Google Tag Manager
    if (initialSettings.gtmId && typeof window !== "undefined") {
      const gtmId = initialSettings.gtmId;
      (function (w: any, d: any, s: any, l: any, i: any) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != "dataLayer" ? "&l=" + l : "";
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", gtmId);
    }

    // 2. Facebook Pixel
    if (initialSettings.fbPixelId && typeof window !== "undefined") {
      const fbPixelId = initialSettings.fbPixelId;
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js",
      );
      if ((window as any).fbq) {
        (window as any).fbq("init", fbPixelId);
        (window as any).fbq("track", "PageView");
      }
    }

    // 3. TikTok Pixel
    if (initialSettings.tiktokPixelId && typeof window !== "undefined") {
      const tiktokPixelId = initialSettings.tiktokPixelId;
      (function (w: any, d: any, t: any) {
        w.TiktokAnalyticsObject = t;
        var tt = (w[t] = w[t] || []);
        ((tt.methods = [
          "page",
          "track",
          "identify",
          "instances",
          "debug",
          "on",
          "off",
          "once",
          "ready",
          "alias",
          "group",
          "enableCookie",
          "disableCookie",
        ]),
          (tt.setAndDefer = function (t: any, e: any) {
            t[e] = function () {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            };
          }));
        for (var i = 0; i < tt.methods.length; i++)
          tt.setAndDefer(tt, tt.methods[i]);
        ((tt.instance = function (t: any) {
          for (var e = tt.methods, n = 0; n < e.length; n++)
            tt.setAndDefer(t, e[n]);
          return t;
        }),
          (tt.load = function (e: any, n: any) {
            var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
            ((tt._i = tt._i || {}),
              (tt._i[e] = []),
              (tt._i[e]._u = i),
              (tt._t = tt._t || {}),
              (tt._t[e] = +new Date()),
              (tt._o = tt._o || {}),
              (tt._o[e] = n || {}));
            var o = document.createElement("script");
            ((o.type = "text/javascript"),
              (o.async = !0),
              (o.src = i + "?sdkid=" + e + "&lib=" + t));
            var a = document.getElementsByTagName("script")[0];
            a.parentNode?.insertBefore(o, a);
          }));
        tt.load(tiktokPixelId);
        tt.page();
      })(window, document, "ttq");
    }

    // 4. Base Script Injection
    if (initialSettings.baseScript && typeof window !== "undefined") {
      const div = document.createElement("div");
      div.id = "custom-base-scripts";
      div.innerHTML = initialSettings.baseScript;
      document.body.appendChild(div);

      return () => {
        const existing = document.getElementById("custom-base-scripts");
        if (existing) existing.remove();
      };
    }
  }, [initialSettings]);

  return null;
}
