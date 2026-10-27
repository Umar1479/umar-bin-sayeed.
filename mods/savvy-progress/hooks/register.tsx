import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Step } from '../types'

const PANE = 'savvy-progress'
const steps = atom({ plugin: 'savvy-progress', key: 'steps' } as const, [], {
  shape: 'steps-1',
})

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'progress',
      description: 'Show live agent progress in a pane',
    })
    void $.ui.open({ id: PANE, title: 'Progress' })

    return next(e)
  })

  on('command.run', { command: 'progress' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Progress' })

    return { text: 'Progress pane opened.' }
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
    const room = Math.max(1, (e.viewport?.rows ?? 24) - 6)

    return (
      <Box flexDirection="column">
        <Text bold>
          {done}/{list.length} steps done
        </Text>
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
