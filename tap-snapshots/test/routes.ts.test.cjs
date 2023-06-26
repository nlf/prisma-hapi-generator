/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/routes.ts TAP generates routes > /lib/routes/author/create.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions, RouteOptionsValidate } from '@hapi/hapi';
import { Schemas, type CreateAuthorPayload } from '../../../lib';

async function handler(request: Request<CreateAuthorPayload>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.author.create({ data: request.payload });

  return h.response(result)
    .code(201);
}

const validate: RouteOptionsValidate = {
  payload: Schemas.CreateAuthor,
};

export const CreateAuthor: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/author/delete.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { AuthorParams } from '../../../lib';

async function handler(request: Request<AuthorParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  await h.prisma.author.delete({
    where: {
      id: request.params.authorId,
    },
  });

  return h.response().code(200);
}

export const DeleteAuthor: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/author/get.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { AuthorParams } from '../../../lib';

async function handler(request: Request<AuthorParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.author.findUnique({
    where: {
      id: request.params.authorId,
    },
  });

  if (!result) {
    h.response().code(404);
  }

  return result;
}

export const GetAuthor: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/author/index.ts 1`] = `
export { CreateAuthor } from './create';
export { DeleteAuthor } from './delete';
export { GetAuthor } from './get';
export { ListAuthor } from './list';
export { UpdateAuthor } from './update';

`

exports[`test/routes.ts TAP generates routes > /lib/routes/author/list.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';

async function handler(request: Request, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.author.findMany();

  return result;
}

export const ListAuthor: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/author/update.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions, RouteOptionsValidate } from '@hapi/hapi';
import { Schemas, type ErrorWithCode, type UpdateAuthorPayload, type AuthorParams } from '../../../lib';

async function handler(request: Request<UpdateAuthorPayload & AuthorParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  try {
    const result = await h.prisma.author.update({
      where: {
        id: request.params.authorId,
      },
      data: request.payload,
    });

    return result;
  }
  catch (err) {
    // istanbul ignore next - no need to test random errors
    if ((err as ErrorWithCode).code !== 'P2025') {
      throw err;
    }

    return h.response().code(404);
  }
}

const validate: RouteOptionsValidate = {
  payload: Schemas.UpdateAuthor,
};

export const UpdateAuthor: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/create.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions, RouteOptionsValidate } from '@hapi/hapi';
import { Schemas, type CreateBookPayload } from '../../../lib';

async function handler(request: Request<CreateBookPayload>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.book.create({ data: request.payload });

  return h.response(result)
    .code(201);
}

const validate: RouteOptionsValidate = {
  payload: Schemas.CreateBook,
};

export const CreateBook: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/delete.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { BookParams } from '../../../lib';

async function handler(request: Request<BookParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  await h.prisma.book.delete({
    where: {
      id: request.params.bookId,
    },
  });

  return h.response().code(200);
}

export const DeleteBook: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/get.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { BookParams } from '../../../lib';

async function handler(request: Request<BookParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.book.findUnique({
    where: {
      id: request.params.bookId,
    },
  });

  if (!result) {
    h.response().code(404);
  }

  return result;
}

export const GetBook: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/index.ts 1`] = `
export { CreateBook } from './create';
export { DeleteBook } from './delete';
export { GetBook } from './get';
export { ListBook } from './list';
export { UpdateBook } from './update';

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/list.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';

async function handler(request: Request, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.book.findMany();

  return result;
}

export const ListBook: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/update.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions, RouteOptionsValidate } from '@hapi/hapi';
import { Schemas, type ErrorWithCode, type UpdateBookPayload, type BookParams } from '../../../lib';

async function handler(request: Request<UpdateBookPayload & BookParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  try {
    const result = await h.prisma.book.update({
      where: {
        id: request.params.bookId,
      },
      data: request.payload,
    });

    return result;
  }
  catch (err) {
    // istanbul ignore next - no need to test random errors
    if ((err as ErrorWithCode).code !== 'P2025') {
      throw err;
    }

    return h.response().code(404);
  }
}

const validate: RouteOptionsValidate = {
  payload: Schemas.UpdateBook,
};

export const UpdateBook: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/index.ts 1`] = `
import type { ServerRoute } from '@hapi/hapi';
import { CreateAuthor, DeleteAuthor, GetAuthor, ListAuthor, UpdateAuthor } from './author';
import { CreateBook, DeleteBook, GetBook, ListBook, UpdateBook } from './book';
import { CreateReview, DeleteReview, GetReview, ListReview, UpdateReview } from './review';

// DO NOT CHANGE THIS ARRAY. It is automatically generated and changes WILL be overwritten
const authorRoutes: ServerRoute[] = [
  { method: 'POST', path: '/author', options: CreateAuthor },
  { method: 'DELETE', path: '/author/{authorId}', options: DeleteAuthor },
  { method: 'GET', path: '/author/{authorId}', options: GetAuthor },
  { method: 'GET', path: '/author', options: ListAuthor },
  { method: 'PUT', path: '/author/{authorId}', options: UpdateAuthor },
];

// DO NOT CHANGE THIS ARRAY. It is automatically generated and changes WILL be overwritten
const bookRoutes: ServerRoute[] = [
  { method: 'POST', path: '/book', options: CreateBook },
  { method: 'DELETE', path: '/book/{bookId}', options: DeleteBook },
  { method: 'GET', path: '/book/{bookId}', options: GetBook },
  { method: 'GET', path: '/book', options: ListBook },
  { method: 'PUT', path: '/book/{bookId}', options: UpdateBook },
];

// DO NOT CHANGE THIS ARRAY. It is automatically generated and changes WILL be overwritten
const reviewRoutes: ServerRoute[] = [
  { method: 'POST', path: '/review', options: CreateReview },
  { method: 'DELETE', path: '/review/{reviewId}', options: DeleteReview },
  { method: 'GET', path: '/review/{reviewId}', options: GetReview },
  { method: 'GET', path: '/review', options: ListReview },
  { method: 'PUT', path: '/review/{reviewId}', options: UpdateReview },
];

const routes: ServerRoute[] = [
  ...authorRoutes,
  ...bookRoutes,
  ...reviewRoutes,
];

export default routes;

`

exports[`test/routes.ts TAP generates routes > /lib/routes/review/create.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions, RouteOptionsValidate } from '@hapi/hapi';
import { Schemas, type CreateReviewPayload } from '../../../lib';

async function handler(request: Request<CreateReviewPayload>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.review.create({ data: request.payload });

  return h.response(result)
    .code(201);
}

const validate: RouteOptionsValidate = {
  payload: Schemas.CreateReview,
};

export const CreateReview: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/review/delete.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { ReviewParams } from '../../../lib';

async function handler(request: Request<ReviewParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  await h.prisma.review.delete({
    where: {
      id: request.params.reviewId,
    },
  });

  return h.response().code(200);
}

export const DeleteReview: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/review/get.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { ReviewParams } from '../../../lib';

async function handler(request: Request<ReviewParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.review.findUnique({
    where: {
      id: request.params.reviewId,
    },
  });

  if (!result) {
    h.response().code(404);
  }

  return result;
}

export const GetReview: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/review/index.ts 1`] = `
export { CreateReview } from './create';
export { DeleteReview } from './delete';
export { GetReview } from './get';
export { ListReview } from './list';
export { UpdateReview } from './update';

`

exports[`test/routes.ts TAP generates routes > /lib/routes/review/list.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';

async function handler(request: Request, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.review.findMany();

  return result;
}

export const ListReview: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/review/update.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions, RouteOptionsValidate } from '@hapi/hapi';
import { Schemas, type ErrorWithCode, type UpdateReviewPayload, type ReviewParams } from '../../../lib';

async function handler(request: Request<UpdateReviewPayload & ReviewParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  try {
    const result = await h.prisma.review.update({
      where: {
        id: request.params.reviewId,
      },
      data: request.payload,
    });

    return result;
  }
  catch (err) {
    // istanbul ignore next - no need to test random errors
    if ((err as ErrorWithCode).code !== 'P2025') {
      throw err;
    }

    return h.response().code(404);
  }
}

const validate: RouteOptionsValidate = {
  payload: Schemas.UpdateReview,
};

export const UpdateReview: RouteOptions = {
  handler,
};

`
