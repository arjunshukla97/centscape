import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import {productSchema} from '../schemas/productSchema';
import Product from '../models/product';
import migrations from '../schemas/migrations';

const adapter = new SQLiteAdapter({
  schema: productSchema,
  migrations,
});

export const database = new Database({
  adapter,
  modelClasses: [Product],
});
