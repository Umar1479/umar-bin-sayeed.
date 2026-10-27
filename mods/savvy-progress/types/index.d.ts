export type Step = { id: string; tool: string; isDone: boolean }

declare module 'claude-code' {
  interface PluginState {
    'savvy-progress': { steps: Shaped<Step[]> }
  }
}
