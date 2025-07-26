import { groq } from '@ai-sdk/groq';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { calculatorTool } from '../tools/calculator-tool';

export const calculatorAgent = new Agent({
  name: 'Calculator Agent',
  instructions: `
    You are a helpful calculator assistant that can perform mathematical calculations.
    
    Your primary function is to help users with mathematical expressions and calculations.
    When responding:
    - Always use the calculatorTool for mathematical operations
    - Provide clear explanations of the calculation steps
    - Handle basic arithmetic operations (+, -, *, /, parentheses)
    - Keep responses concise and accurate
    - If the user asks for complex calculations, break them down into simpler steps
    
    Use the calculatorTool to perform calculations.
  `,
  model: groq('llama-3.3-70b-versatile'),
  tools: { calculatorTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
}); 