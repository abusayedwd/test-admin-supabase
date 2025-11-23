import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Users, Crown, UserCheck, TrendingUp, Activity } from 'lucide-react'
import type { UserStats } from '@/lib/types/users'

interface UsersStatsCardsProps {
  stats: UserStats
  isLoading: boolean
}

export default function UsersStatsCards({ stats, isLoading }: UsersStatsCardsProps) {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.total_users.toLocaleString(),
      description: 'Registered users',
      icon: Users,
      color: 'blue'
    },
    // {
    //   title: 'Premium Users',
    //   value: stats.premium_users.toLocaleString(),
    //   description: 'Active subscriptions',
    //   icon: Crown,
    //   color: 'yellow'
    // },
    {
      title: 'Free Users',
      value: stats.free_users.toLocaleString(),
      description: 'Free tier users',
      icon: UserCheck,
      color: 'green'
    },
    {
      title: 'New This Month',
      value: stats.new_users_this_month.toLocaleString(),
      description: 'Recent registrations',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Active (30 days)',
      value: stats.active_users_last_30_days.toLocaleString(),
      description: 'Recent activity',
      icon: Activity,
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${getColorClasses(card.color)}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 