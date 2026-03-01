"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Podaci po tipu aktivnosti
type ActivityStats = {
  tip: string;
  broj: number;
  boja: string;
};

// Chart za broj aktivnosti po tipu (Bar Chart)
export function ActivitiesBarChart({ data }: { data: ActivityStats[] }) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="tip" 
            stroke="#6b7280"
            style={{ fontSize: '14px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '14px' }}
            label={{ value: 'Broj aktivnosti', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar 
            dataKey="broj" 
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.boja} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Chart za distribuciju aktivnosti (Pie Chart)
// export function ActivitiesPieChart({ data }: { data: ActivityStats[] }) {
//   const COLORS = data.map(d => d.boja);

//   return (
//     <div className="w-full h-[300px]">
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             labelLine={false}
//             label={({ tip, broj }) => `${tip}: ${broj}`}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="broj"
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// Chart za aktivnosti po mesecima (Line Chart)
type MonthlyStats = {
  mesec: string;
  broj: number;
};

export function ActivitiesLineChart({ data }: { data: MonthlyStats[] }) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="mesec" 
            stroke="#6b7280"
            style={{ fontSize: '14px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '14px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar 
            dataKey="broj" 
            fill="#fbbf24"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}