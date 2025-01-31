import { db } from './db';

// db.product.toHandlers('rest') is a function that returns an array of handlers with endpoint /products
export const handlers = [
  ...db.product.toHandlers('rest'),
  ...db.category.toHandlers('rest'),
];
