import axios, {AxiosError} from 'axios';
import {database} from '../database';
import Product from '../models/product';
import {Q} from '@nozbe/watermelondb';
import {NETWORK_IP, PORT} from '../../utils/constants';

export async function fetchAndSaveProduct(url: string) {
  try {
    const response = await axios.post(`http://${NETWORK_IP}:${PORT}/preview`, {
      url,
    });
    console.log(response.data, 'api mey');
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.log('Error fetching product:', err.response?.data || err.message);

    return {
      success: false,
      message:
        (err.response?.data as any)?.error?.message || 'Something went wrong',
      status: err.response?.status,
    };
  }
}

export const saveToDb = async (product: Product) => {
  try {
    const {title, image, price, currency, siteName, sourceUrl} = product;
    const normalizedUrl = normalizeUrl(sourceUrl);
    if (!normalizedUrl) {
      return {success: false, message: 'Invalid product URL'};
    }
    const productCollection = database.get<Product>('products');
    const existing = await productCollection
      .query(Q.where('normalized_url', normalizedUrl))
      .fetch();

    if (existing.length > 0) {
      return {
        success: false,
        message: 'Product already exists in your wishlist!',
      };
    }

    console.log(product, 'product');
    await database.write(async () => {
      await productCollection.create(product => {
        product.title = title;
        product.image = image;
        product.price = String(price);
        product.currency = currency;
        product.siteName = siteName;
        product.sourceUrl = sourceUrl;
        product.createdAt = Date.now();
        product.normalizedUrl = normalizedUrl;
      });
    });

    return {
      success: true,
      message: 'Product added to Wishlist!',
      product: {
        title,
        image,
        price: String(price),
        currency,
        siteName,
        sourceUrl,
        createdAt: Date.now(),
        normalizedUrl,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Error saving product!',
    };
  }
};

export function normalizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');

    parsed.protocol = 'https:';

    parsed.searchParams.forEach((_, key) => {
      if (key.toLowerCase().startsWith('utm_')) {
        parsed.searchParams.delete(key);
      }
    });

    parsed.hash = '';
    parsed.pathname = parsed.pathname.replace(/\/$/, '');

    return parsed.toString();
  } catch {
    return null;
  }
}
