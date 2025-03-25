import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Welcome back! Here's an overview of your account.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Customers"
          value="2,543"
          trend="+12.5%"
          description="From last month"
          icon={<Users className="h-5 w-5" />}
        />

        <StatsCard
          title="Total Orders"
          value="512"
          trend="+18.2%"
          description="From last month"
          icon={<ShoppingCart className="h-5 w-5" />}
        />

        <StatsCard
          title="Revenue"
          value="$12,390"
          trend="+8.1%"
          description="From last month"
          icon={<DollarSign className="h-5 w-5" />}
        />

        <StatsCard
          title="Growth"
          value="24.5%"
          trend="+2.3%"
          description="From last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">Order #{1000 + i}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(2025, 2, 25 - i).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(Math.random() * 200 + 50).toFixed(2)}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {["Completed", "Processing", "Shipped", "Completed", "Processing"][i-1]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest activities in your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New customer registered", user: "John Smith", time: "10 minutes ago" },
                { action: "New order placed", user: "Sarah Johnson", time: "2 hours ago" },
                { action: "Payment received", user: "Michael Brown", time: "3 hours ago" },
                { action: "Order shipped", user: "Lisa Williams", time: "5 hours ago" },
                { action: "Customer support ticket resolved", user: "Robert Davis", time: "Yesterday" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-medium">{activity.user.split(" ").map(name => name[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  description: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, trend, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800">
            {icon}
          </div>
          <div className="flex items-center text-emerald-500 text-sm font-medium">
            {trend} <ArrowUpRight className="h-3 w-3 ml-1" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
