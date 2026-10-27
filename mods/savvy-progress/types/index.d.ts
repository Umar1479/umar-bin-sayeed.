export type Step = { id: string; tool: string; isDone: boolean }

export type Todo = { id?: string; content: string; status: 'pending' | 'in_progress' | 'completed' }

declare module 'claude-code' {
  interface PluginState {
    'savvy-progress': { steps: Shaped<Step[]>; todos: Shaped<Todo[]>; startedAt: Shaped<number>; tick: Shaped<number> }
  }
}
