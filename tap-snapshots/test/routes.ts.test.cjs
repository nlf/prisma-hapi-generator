/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/routes.ts TAP generates routes > /lib/routes/author/create.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions, RouteOptionsValidate } from '@hapi/hapi';
import { CreateAuthorSchema } from '../../schemas';
import type { CreateAuthorPayload } from '../../types';

async function handler(request: Request<CreateAuthorPayload>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.author.create({ data: request.payload });

  return h.response(result)
    .code(201);
}

const validate: RouteOptionsValidate = {
  payload: CreateAuthorSchema,
};

export const CreateAuthorRoute: RouteOptions = {
  handler,
  validate,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/author/delete.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { AuthorParams } from '../../types';

async function handler(request: Request<AuthorParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  await h.prisma.author.delete({
    where: {
      id: request.params.authorId,
    },
  });

  return h.response().code(200);
}

export const DeleteAuthorRoute: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/author/get.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { AuthorParams } from '../../types';

async function handler(request: Request<AuthorParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.author.findUnique({
    where: {
      id: request.params.authorId,
    },
  });

  if (!result) {
    return h.response().code(404);
  }

  return result;
}

export const GetAuthorRoute: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/author/index.ts 1`] = `
export { CreateAuthorRoute } from './create';
export { DeleteAuthorRoute } from './delete';
export { GetAuthorRoute } from './get';
export { ListAuthorRoute } from './list';
export { UpdateAuthorRoute } from './update';

`

exports[`test/routes.ts TAP generates routes > /lib/routes/author/list.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';

async function handler(request: Request, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.author.findMany();

  return result;
}

export const ListAuthorRoute: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/author/update.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions, RouteOptionsValidate } from '@hapi/hapi';
import { UpdateAuthorSchema } from '../../schemas';
import type { ErrorWithCode, UpdateAuthorPayload, AuthorParams } from '../../types';

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
  payload: UpdateAuthorSchema,
};

export const UpdateAuthorRoute: RouteOptions = {
  handler,
  validate,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/create.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions, RouteOptionsValidate } from '@hapi/hapi';
import { CreateBookSchema } from '../../schemas';
import type { CreateBookPayload } from '../../types';

async function handler(request: Request<CreateBookPayload>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.book.create({ data: request.payload });

  return h.response(result)
    .code(201);
}

const validate: RouteOptionsValidate = {
  payload: CreateBookSchema,
};

export const CreateBookRoute: RouteOptions = {
  handler,
  validate,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/delete.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { BookParams } from '../../types';

async function handler(request: Request<BookParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  await h.prisma.book.delete({
    where: {
      id: request.params.bookId,
    },
  });

  return h.response().code(200);
}

export const DeleteBookRoute: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/get.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { BookParams } from '../../types';

async function handler(request: Request<BookParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.book.findUnique({
    where: {
      id: request.params.bookId,
    },
  });

  if (!result) {
    return h.response().code(404);
  }

  return result;
}

export const GetBookRoute: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/index.ts 1`] = `
export { CreateBookRoute } from './create';
export { DeleteBookRoute } from './delete';
export { GetBookRoute } from './get';
export { ListBookRoute } from './list';
export { UpdateBookRoute } from './update';

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/list.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';

async function handler(request: Request, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.book.findMany();

  return result;
}

export const ListBookRoute: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/book/update.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions, RouteOptionsValidate } from '@hapi/hapi';
import { UpdateBookSchema } from '../../schemas';
import type { ErrorWithCode, UpdateBookPayload, BookParams } from '../../types';

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
  payload: UpdateBookSchema,
};

export const UpdateBookRoute: RouteOptions = {
  handler,
  validate,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/index.ts 1`] = `
import type { ServerRoute } from '@hapi/hapi';
import { CreateAuthorRoute, DeleteAuthorRoute, GetAuthorRoute, ListAuthorRoute, UpdateAuthorRoute } from './author';
import { CreateBookRoute, DeleteBookRoute, GetBookRoute, ListBookRoute, UpdateBookRoute } from './book';
import { CreateReviewRoute, DeleteReviewRoute, GetReviewRoute, ListReviewRoute, UpdateReviewRoute } from './review';

// DO NOT CHANGE THIS ARRAY. It is automatically generated and changes WILL be overwritten
const authorRoutes: ServerRoute[] = [
  { method: 'POST', path: '/author', options: CreateAuthorRoute },
  { method: 'DELETE', path: '/author/{authorId}', options: DeleteAuthorRoute },
  { method: 'GET', path: '/author/{authorId}', options: GetAuthorRoute },
  { method: 'GET', path: '/author', options: ListAuthorRoute },
  { method: 'PUT', path: '/author/{authorId}', options: UpdateAuthorRoute },
];

// DO NOT CHANGE THIS ARRAY. It is automatically generated and changes WILL be overwritten
const bookRoutes: ServerRoute[] = [
  { method: 'POST', path: '/book', options: CreateBookRoute },
  { method: 'DELETE', path: '/book/{bookId}', options: DeleteBookRoute },
  { method: 'GET', path: '/book/{bookId}', options: GetBookRoute },
  { method: 'GET', path: '/book', options: ListBookRoute },
  { method: 'PUT', path: '/book/{bookId}', options: UpdateBookRoute },
];

// DO NOT CHANGE THIS ARRAY. It is automatically generated and changes WILL be overwritten
const reviewRoutes: ServerRoute[] = [
  { method: 'POST', path: '/review', options: CreateReviewRoute },
  { method: 'DELETE', path: '/review/{reviewId}', options: DeleteReviewRoute },
  { method: 'GET', path: '/review/{reviewId}', options: GetReviewRoute },
  { method: 'GET', path: '/review', options: ListReviewRoute },
  { method: 'PUT', path: '/review/{reviewId}', options: UpdateReviewRoute },
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
import { CreateReviewSchema } from '../../schemas';
import type { CreateReviewPayload } from '../../types';

async function handler(request: Request<CreateReviewPayload>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.review.create({ data: request.payload });

  return h.response(result)
    .code(201);
}

const validate: RouteOptionsValidate = {
  payload: CreateReviewSchema,
};

export const CreateReviewRoute: RouteOptions = {
  handler,
  validate,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/review/delete.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { ReviewParams } from '../../types';

async function handler(request: Request<ReviewParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  await h.prisma.review.delete({
    where: {
      id: request.params.reviewId,
    },
  });

  return h.response().code(200);
}

export const DeleteReviewRoute: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/review/get.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import type { ReviewParams } from '../../types';

async function handler(request: Request<ReviewParams>, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.review.findUnique({
    where: {
      id: request.params.reviewId,
    },
  });

  if (!result) {
    return h.response().code(404);
  }

  return result;
}

export const GetReviewRoute: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/review/index.ts 1`] = `
export { CreateReviewRoute } from './create';
export { DeleteReviewRoute } from './delete';
export { GetReviewRoute } from './get';
export { ListReviewRoute } from './list';
export { UpdateReviewRoute } from './update';

`

exports[`test/routes.ts TAP generates routes > /lib/routes/review/list.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';

async function handler(request: Request, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> {
  const result = await h.prisma.review.findMany();

  return result;
}

export const ListReviewRoute: RouteOptions = {
  handler,
};

`

exports[`test/routes.ts TAP generates routes > /lib/routes/review/update.ts 1`] = `
import type { Lifecycle, Request, ResponseToolkit, RouteOptions, RouteOptionsValidate } from '@hapi/hapi';
import { UpdateReviewSchema } from '../../schemas';
import type { ErrorWithCode, UpdateReviewPayload, ReviewParams } from '../../types';

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
  payload: UpdateReviewSchema,
};

export const UpdateReviewRoute: RouteOptions = {
  handler,
  validate,
};

`
