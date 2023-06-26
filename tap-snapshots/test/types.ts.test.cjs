/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/types.ts TAP generates types > /lib/types.ts 1`] = `
// DO NOT EDIT THIS FILE! It is automatically generated and changes WILL be overwritten

import type * as Hapi from '@hapi/hapi';
import type { Prisma, PrismaClient } from './client';

export interface ErrorWithCode extends Error {
  code: string;
}

export interface CreateAuthorPayload extends Hapi.ReqRefDefaults {
  Payload: Prisma.AuthorCreateInput;
}

export interface UpdateAuthorPayload extends Hapi.ReqRefDefaults {
  Payload: Prisma.AuthorUpdateInput;
}

interface AuthorIdParam {
  authorId: number;
}

export interface AuthorParams extends Hapi.ReqRefDefaults {
  Params: AuthorIdParam;
}

export interface CreateBookPayload extends Hapi.ReqRefDefaults {
  Payload: Prisma.BookCreateInput;
}

export interface UpdateBookPayload extends Hapi.ReqRefDefaults {
  Payload: Prisma.BookUpdateInput;
}

interface BookIdParam {
  bookId: string;
}

export interface BookParams extends Hapi.ReqRefDefaults {
  Params: BookIdParam;
}

export interface CreateReviewPayload extends Hapi.ReqRefDefaults {
  Payload: Prisma.ReviewCreateInput;
}

export interface UpdateReviewPayload extends Hapi.ReqRefDefaults {
  Payload: Prisma.ReviewUpdateInput;
}

interface ReviewIdParam {
  reviewId: string;
}

export interface ReviewParams extends Hapi.ReqRefDefaults {
  Params: ReviewIdParam;
}

declare module '@hapi/hapi' {
  interface ServerApplicationState extends Hapi.ServerApplicationState {
    prisma: PrismaClient;
  }

  interface ResponseToolkit extends Hapi.ResponseToolkit {
    prisma: PrismaClient;
  }
}

`
