import { Stats as StatsType } from '@/models/Stats'
import { stressLevels } from '@/models/StressLevels'
import { LineChart } from '@/pages/AdminPage/LineChart'

type StatsProps = {
  stats: StatsType
}

export const Stats = ({ stats }: StatsProps) => {
  return (
    <div className="mb-6">
      <div className="gap-4 grid grid-cols-2 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-md font-semibold mb-2">Total Responses</h3>
          <p className="text-2xl font-bold text-blue-600" data-testid="total-responses">{stats.total_responses}</p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-md font-semibold mb-2">Average Stress Level</h3>
          <p className="text-2xl font-bold text-blue-600" data-testid="average-stress">{stats.average_stress}</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded shadow mb-6">
        <h3 className="text-md font-semibold mb-2">Stress Level Distribution</h3>
        {stats.stress_distribution && (
          <div className="px-4 pt-4">
            <div className="flex justify-between w-full" style={{minHeight: '150px'}}>
              {Object.entries(stats.stress_distribution).map(([level, count]) => {
                const maxCount = Math.max(...Object.values(stats.stress_distribution));
                const heightPercent = Math.max((count / maxCount) * 100, 1);
                const selectedStressLevel = stressLevels[level as keyof typeof stressLevels]
                return (
                  <div key={`bar-container-${level}`} className="flex flex-col items-center w-1/5">
                    <div key={`label-${level}`} className="text-sm font-medium text-center" data-testid={`stress-level-count-${level}`}>
                      {count}
                    </div>
                    <div style={{height: '120px', width: '90%', position: 'relative'}}>
                      <div
                        className="absolute bottom-0 left-0 right-0"
                        data-testid={`stress-level-bar-${level}`}
                        data-test-height-percent={heightPercent}
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: selectedStressLevel.color
                        }}
                      ></div>
                    </div>
                    <div className="text-sm mt-2 text-center">{selectedStressLevel.label} - {level}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {stats.last_90_days_responses && (
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-md font-semibold mb-2">Responses Trend</h3>
          <LineChart data={stats.last_90_days_responses} title="Stress Levels Over Time" />
        </div>
      )}
    </div>
  )
}
