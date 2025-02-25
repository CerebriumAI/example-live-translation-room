import { z } from "zod"

export const nameSchema = z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")

export const roomIdSchema = z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/, "Room ID must only contain letters, numbers, and hyphens")

export const createRoomSchema = z.object({
    name: nameSchema,
})

export const joinRoomSchema = z.object({
    name: nameSchema,
    roomId: roomIdSchema,
})

export const createTokenSchema =  z.object({
    name: nameSchema,
    roomId: roomIdSchema,
})

