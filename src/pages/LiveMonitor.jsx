import React from 'react';
import { Card, CardContent } from '../components/common/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const sampleData = [
  { time: '00s', railPressure: 32000 },
  { time: '05s', railPressure: 35500 },
  { time: '10s', railPressure: 34800 },
  { time: '15s', railPressure: 36600 },
  { time: '20s', railPressure: 35200 },
  { time: '25s', railPressure: 37400 },
];

export default function LiveMonitor() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Live Monitor</h1>
      <Card>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#cbd5e1' }}
              />
              <Line type="monotone" dataKey="railPressure" stroke="#22d3ee" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
