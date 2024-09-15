import { date } from 'drizzle-orm/mysql-core'
import { client, db } from '.'
import { goals, goalsCompletions } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalsCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar Cedo', desiredWeeklyFrequency: 5 },
      { title: 'Exercitar', desiredWeeklyFrequency: 3 },
      { title: 'Meditar', desiredWeeklyFrequency: 1 },
    ])
    .returning()

  const startOffWeeks = dayjs().startOf('week')
  await db.insert(goalsCompletions).values([
    { goalId: result[0].id, createdAt: startOffWeeks.toDate() },
    { goalId: result[1].id, createdAt: startOffWeeks.add(1, 'day').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
