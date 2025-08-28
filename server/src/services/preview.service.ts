import { parse } from 'node-html-parser';
import axios from 'axios';
import { ApiResponse, PreviewData } from '../utils/response';

export async function fetchPreview(
  url: string,
): Promise<ApiResponse<PreviewData>> {
  try {
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'UnifiedWishlistBot/1.0' },
      maxRedirects: 3,
      timeout: 5000,
      responseType: 'text',
      validateStatus: status => status >= 200 && status < 400,
    });

    const html = res.data as string;

    if (html.length > 512 * 1024) {
      return { success: false, status: 413, error: { message: 'HTML size exceeds 512 KB' } };
    }

    const root = parse(html);

    const title =
      root.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      root.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
      root.querySelector('title')?.text ||
      'No title';

    const image =
      root.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
      root.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
      '';

    let price = 'N/A';
    let currency = 'USD';

    const priceMeta = root.querySelector('meta[property="product:price:amount"]');
    if (priceMeta) price = priceMeta.getAttribute('content') || 'N/A';

    const jsonLd = root.querySelectorAll('script[type="application/ld+json"]');
    for (const tag of jsonLd) {
      try {
        const data = JSON.parse(tag.text);
        if (data.offers?.price) {
          price = data.offers.price;
          if (data.offers.priceCurrency) currency = data.offers.priceCurrency;
          break;
        }
      } catch {}
    }

    if (price === 'N/A') {
      const match = html.match(/(\$|₹|€)\s?(\d+(?:\.\d{1,2})?)/);
      if (match) {
        price = match[2];
        currency = match[1];
      }
    }

    const siteName = new URL(url).hostname;

    return { success: true, status: 200, data: { title, image, price, currency, siteName, sourceUrl: url } };
  } catch (err: any) {
    return { success: false, status: err.response?.status || 500, error: { message: err.message, code: err.code } };
  }
}
