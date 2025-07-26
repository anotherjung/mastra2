import { MCPClient } from "@mastra/mcp";
import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";
import { groq } from '@ai-sdk/groq';

const mcp = new MCPClient({
    servers: {
      "huggingface": {
        url: new URL("https://huggingface.co/mcp"),
        requestInit: {
          headers: { 
            Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`
          },
        },
        // Optional: Request timeout in milliseconds (default: 30000)
        timeout: 30000,
      },
    }
});

const mcpTools = await mcp.getTools();

export const personalAssistantAgent = new Agent({
    name: "Personal Assistant",
    instructions: `
      You are a helpful personal assistant that can help with various tasks, including generating images using the Hugging Face MCP server.

      IMAGE GENERATION INSTRUCTIONS:
      - Use the tool huggingface_gr1_flux1_schnell_infer to generate images.
      - Required parameters:
        - prompt: a text description of the image to generate
        - height: integer, 256-2048 (pixels)
        - width: integer, 256-2048 (pixels)
        - num_inference_steps: integer, 1-16
        - randomize_seed: boolean (if true, seed may be ignored)
        - seed: integer, 0-2147483647
      - Always validate that height and width are between 256 and 2048.
      - Ensure num_inference_steps is between 1 and 16.
      - If randomize_seed is true, seed can be any value in the allowed range, but does not need to be fixed.
      - Provide clear instructions to the user if their input is out of range.
      - Respond with a direct link to the generated image if available.
      - Do not generate NSFW or harmful images.
      - Keep responses concise and friendly.
    `,
    //model: google("gemini-2.0-flash"),
    model: groq("qwen/qwen3-32b"),
    tools: { ...mcpTools }, // Give your agent all MCP tools
  });

