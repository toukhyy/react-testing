// import { http, HttpResponse } from 'msw';
// import { products } from './data';
import { db } from './db';

// export const handlers = [
//   http.get('/categories', () => {
//     return HttpResponse.json(products);
//   }),

//   http.get('/products', () => {
//     return HttpResponse.json();
//   }),

//   http.get('/products/:id', ({ params }) => {
//     const id = Number(params.id);
//     const product = products.find((p) => p.id === id);

//     return product ? HttpResponse.json(product) : HttpResponse.error();
//   }),
// ];

export const handlers = [...db.product.toHandlers('rest')];
