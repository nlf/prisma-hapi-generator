## prisma-joi

This is a generator for [prisma]() that outputs Joi schemas for each of your models.


### Usage

```prisma
generator joi {
  provider = "prisma-joi"
  output = "./schema.ts"
}
```
