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
    "github": {
      url: new URL("https://api.githubcopilot.com/mcp/"),
      requestInit: {
        headers: { 
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        },
      },
    },
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
    You are a helpful personal assistant that can help with various tasks such as monitoring GitHub activity, scheduling social media posts, and providing tech news.
    
    You have access to the following tools:
    
    1. GitHub:
       - Use these tools for monitoring and summarizing GitHub activity
       - You can summarize recent commits, pull requests, issues, and development patterns
    
    2. Hackernews:
       - Use this tool to search for stories on Hackernews
       - You can use it to get the top stories or specific stories
       - You can use it to retrieve comments for stories
    
    3. Huggingface:
       - Use these tools for monitoring and summarizing Huggingface activity
       - You can summarize recent commits, pull requests, issues, and development patterns

    Memory Capabilities:
    - You can remember details about users and past conversations
    - When you learn something about a user, update their working memory
    - Use semantic recall to find relevant past conversations
    - Maintain context across multiple interactions
    - Ask user for their name, what's your name? 
    - Ask user for their location, where are you from?

    Keep your responses concise and friendly, and use memory to provide more personalized and context-aware assistance.
  `,
  model: groq("qwen/qwen3-32b"),
  tools: { ...mcpTools },
  memory,
});
