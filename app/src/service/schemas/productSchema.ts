import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const productSchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'products',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'image', type: 'string', isOptional: true},
        {name: 'price', type: 'string', isOptional: true},
        {name: 'currency', type: 'string', isOptional: true},
        {name: 'site_name', type: 'string', isOptional: true},
        {name: 'source_url', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'normalized_url', type: 'string'},
      ],
    }),
  ],
});
