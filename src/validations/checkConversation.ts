import { z } from "zod";

const FunctionPropertySchema = z.object({
  type: z.string(),
  description: z.string(),
});

const FunctionParameterSchema = z.object({
  type: z.string(),
  properties: z.record(FunctionPropertySchema),
  required: z.array(z.string()),
});

const FunctionDetailsSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: FunctionParameterSchema,
});

const FunctionCallSchema = z.object({
  name: z.string(),
  arguments: z.string(),
});

const MessageSchema = z.object({
  role: z.string(),
  content: z.string().optional(),
  function_call: FunctionCallSchema.optional(),
});

const ConversationSchema = z.object({
  messages: z.array(MessageSchema),
  functions: z.array(FunctionDetailsSchema).optional(),
});

export default function checkConversation(line: string) {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const object = JSON.parse(trimmed)
    ConversationSchema.parse(object)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return `Error on conversation: ${error.errors.map((err) => `${err.path} (${err.message})`).join("; ")}`
    }
  }
}
