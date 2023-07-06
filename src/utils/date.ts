import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import UTC from 'dayjs/plugin/utc'
dayjs.extend(relativeTime)
dayjs.extend(UTC)

export const formatDateTimeConversational = (date: Date) =>
  date ? dayjs(date).fromNow() : date
