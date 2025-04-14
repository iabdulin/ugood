import { stressLevels } from '@/models/StressLevels'

export type StressDataPoint = {
  stress_level: keyof typeof stressLevels;
  created_at: string;
}

export type Stats = {
  total_responses: number,
  average_stress: number,
  stress_distribution: Record<keyof typeof stressLevels, number>,
  last_90_days_responses: StressDataPoint[]
}
