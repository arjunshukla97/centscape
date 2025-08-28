import {Model} from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';

export default class Product extends Model {
  static table = 'products';

  @text('title') title!: string;
  @text('image') image!: string;
  @text('price') price!: string;
  @text('currency') currency!: string;
  @text('site_name') siteName!: string;
  @text('source_url') sourceUrl!: string;
  @field('created_at') createdAt!: number;
  @text('normalized_url') normalizedUrl!: string;
}
