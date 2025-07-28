import { MCPClient } from "@mastra/mcp";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
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
    },
    // zapier: {
    //   url: new URL(process.env.ZAPIER_MCP_URL || ""),
    // },
    // github: {
    //   url: new URL(process.env.COMPOSIO_MCP_GITHUB || ""),
    // },
    hackernews: {
      command: "npx",
      args: ["-y", "@devabdultech/hn-mcp-server"],
    },
  },
});

const mcpTools = await mcp.getTools();

// Configure basic memory
const memory = new Memory({
  options: {
    // Keep last 20 messages in context
    lastMessages: 20,
    // Enable working memory to remember user information
    workingMemory: {
      enabled: true,
      template: `
      <user>
        <first_name></first_name>
        <username></username>
        <preferences></preferences>
        <interests></interests>
        <conversation_style></conversation_style>
      </user>`,
    },
  },
});

export const personalAssistantAgent = new Agent({
  name: "Personal Assistant",
  instructions: `
    You are a helpful personal assistant that can help with various tasks such as email, 
    monitoring github activity, and scheduling social media posts.
    
    You have access to the following tools:
    
    1. Gmail:
       - Use these tools for reading and categorizing emails from Gmail
       - You can categorize emails by priority, identify action items, and summarize content
       - You can also use this tool to send emails
    
    2. GitHub:
       - Use these tools for monitoring and summarizing GitHub activity
       - You can summarize recent commits, pull requests, issues, and development patterns
    
    2. GitHub:
       - Use these tools for monitoring and summarizing GitHub activity
       - You can summarize recent commits, pull requests, issues, and development patterns
    
    3. Hackernews:
       - Use this tool to search for stories on Hackernews
       - You can use it to get the top stories or specific stories
       - You can use it to retrieve comments for stories
    
    Keep your responses concise and friendly.
  `,
  model: groq("qwen/qwen3-32b"),
  tools: { ...mcpTools },
  memory,
});
