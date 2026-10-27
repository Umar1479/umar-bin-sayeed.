import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Step, Todo } from '../types'

const PANE = 'savvy-progress'
const steps = atom({ plugin: 'savvy-progress', key: 'steps' } as const, [], {
  shape: 'steps-1',
})

const todos = atom({ plugin: 'savvy-progress', key: 'todos' } as const, [], {
  shape: 'todos-1',
})
const startedAt = atom(
  { plugin: 'savvy-progress', key: 'startedAt' } as const,
  0,
  { shape: 'started-1' },
)
const tick = atom({ plugin: 'savvy-progress', key: 'tick' } as const, 0, {
  shape: 'tick-1',
})

const clock = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)

  return m > 0 ? `${m}m ${String(s % 60).padStart(2, '0')}s` : `${s}s`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'progress',
      description: 'Show live agent progress in a pane',
    })
    const now = await $.clock.now()
    await update($, startedAt, () => now)
    $.clock.every(1000, () => void update($, tick, n => n + 1))
    void $.ui.open({ id: PANE, title: 'Progress' })

    return next(e)
  })

  on('command.run', { command: 'progress' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Progress' })

    return { text: 'Progress pane opened.' }
  })

  on('tool.call', { tool: 'TodoWrite' }, async ($, e, next) => {
    await update($, todos, () =>
      e.todos.map(t => ({ content: t.content, status: t.status })),
    )

    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const step: Step = { id: e.tool_use_id, tool: e.tool, isDone: false }
    await update($, steps, list => [...list, step].slice(-200))
    $.ui.status(`working: ${e.tool}`)
    const ran = await next(e)
    await update($, steps, list =>
      list.map(one => (one.id === step.id ? { ...one, isDone: true } : one)),
    )
    $.ui.status(undefined)

    return ran
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const list = await read($, steps)
    const done = list.filter(s => s.isDone).length
    const current = list.filter(s => !s.isDone).slice(-1)[0]
    const list2 = await read($, todos)
    void (await read($, tick))
    const began = await read($, startedAt)
    const elapsed = began > 0 ? clock((await $.clock.now()) - began) : '0s'
    const room = Math.max(1, (e.viewport?.rows ?? 24) - 8 - list2.length)

    return (
      <Box flexDirection="column">
        <Text bold>
          {done}/{list.length} steps done · {elapsed}
        </Text>
        {list2.length > 0 && (
          <Box flexDirection="column">
            <Text bold>Plan</Text>
            {list2.map((t: Todo) => (
              <Text dimColor={t.status === 'completed'}>
                {t.status === 'completed' ? '[x]' : t.status === 'in_progress' ? '[>]' : '[ ]'}{' '}
                {t.content}
              </Text>
            ))}
          </Box>
        )}
        <Text>{current ? `Now: ${current.tool}` : 'Idle'}</Text>
        {list.slice(-room).map(s => (
          <Text dimColor={s.isDone}>
            {s.isDone ? '✓' : '…'} {s.tool}
          </Text>
        ))}
      </Box>
    )
  })
}
