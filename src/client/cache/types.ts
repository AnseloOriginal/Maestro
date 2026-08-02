import { z } from "zod"


export const DB_KEY = "MaestroV1_"

const testSchema = z.object({
  test1: z.number().default(1),
  test2: z.number().default(2)
})

const UserSchema = z.object({
  username: z.string(),
  firstname: z.string(),
  surname: z.string(),
  othername: z.string().default(""),
  student: z.literal([0, 1]).default(0),
  verified: z.literal([0, 1]).default(0),
  joined: z.string().default(() => new Date().getFullYear().toString())
})

export const versionSchema = z.string()

export const SchemaMap = {
  'username': UserSchema,
  'test': testSchema,
  'version': versionSchema
}

export type SchemaTypes = {
  [K in keyof typeof SchemaMap]: z.infer<(typeof SchemaMap)[K]>;
};
