# Mastra Course Project

A simple, reliable, light, and fast Mastra application demonstrating AI workflows.

## 🚀 Quick Start

```bash
npm run dev
```

Visit: http://localhost:4112

## 📁 Project Structure

```
src/mastra/
├── agents/           # AI Agents
│   ├── weather-agent.ts
│   └── calculator-agent.ts
├── tools/            # Tools for agents
│   ├── weather-tool.ts
│   └── calculator-tool.ts
├── workflows/        # Workflow definitions
│   ├── weather-workflow.ts
│   └── calculator-workflow.ts
└── index.ts          # Main configuration
```

## 🔧 Available Workflows

### Weather Workflow
- **Input**: `{ city: string }`
- **Output**: `{ activities: string }`
- **Function**: Fetches weather data and suggests activities

### Calculator Workflow
- **Input**: `{ expression: string }`
- **Output**: `{ result: number, explanation: string }`
- **Function**: Performs mathematical calculations with explanations

## 🎯 Design Principles

- **Simple**: Minimal code, clear functions
- **Reliable**: Type safety with TypeScript and Zod
- **Light**: Fast imports, efficient components
- **Fast**: Optimized for runtime performance

## 🛠️ Development

The server auto-reloads when you make changes. Just save your files and test in the playground!

## 📚 Next Steps

1. Explore the Mastra Playground at http://localhost:4112
2. Test the weather workflow with different cities
3. Try the calculator workflow with mathematical expressions
4. Build your own workflows following the same patterns 