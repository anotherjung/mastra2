import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const calculationSchema = z.object({
  expression: z.string(),
  result: z.number(),
  explanation: z.string(),
});

const calculateStep = createStep({
  id: 'calculate',
  description: 'Performs mathematical calculations with explanation',
  inputSchema: z.object({
    expression: z.string().describe('Mathematical expression to evaluate'),
  }),
  outputSchema: calculationSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const agent = mastra?.getAgent('calculatorAgent');
    if (!agent) {
      throw new Error('Calculator agent not found');
    }

    const prompt = `Please calculate the following mathematical expression: ${inputData.expression}
    
    Provide:
    1. The exact result
    2. A brief explanation of the calculation steps
    3. Any important mathematical rules applied
    
    Keep the explanation concise but clear.`;

    const response = await agent.stream([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let explanation = '';
    for await (const chunk of response.textStream) {
      explanation += chunk;
    }

    return {
      expression: inputData.expression,
      result: 0, // Placeholder - will be calculated by agent
      explanation: explanation.trim(),
    };
  },
});

const calculatorWorkflow = createWorkflow({
  id: 'calculator-workflow',
  inputSchema: z.object({
    expression: z.string().describe('Mathematical expression to evaluate'),
  }),
  outputSchema: z.object({
    result: z.number(),
    explanation: z.string(),
  }),
})
  .then(calculateStep);

calculatorWorkflow.commit();

export { calculatorWorkflow }; 