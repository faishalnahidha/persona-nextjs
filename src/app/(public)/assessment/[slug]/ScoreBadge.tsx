import { IconCircleLetterS } from '@tabler/icons-react'

interface ScoreBadgeProps {
  score: number
  className?: string
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  return (
    <div className={`bg-amber-100 rounded-lg h-6 pl-2 pr-2.5 py-0.5 items-center gap-1 ${className ?? ''}`}>
      <IconCircleLetterS size={16} className='text-amber-600' />
      <span className='para-sm-medium font-mono text-secondary-foreground'>{score}</span>
    </div>
  )
}
