import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Svg, Circle, Rect, Text as SvgText, G, Path } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';

const progressData = [65, 30, 15];
const progressLabels = ['Maize', 'Trees', 'Poultry'];
const goalStatus = [6, 3, 5]; // Completed, In Progress, Pending
const goalColors = ['#22c55e', '#fb923c', '#a3a3a3'];

export default function ProjectAnalytics() {
  // Statistics
  const stats = {
    onTime: 75,
    total: 14,
    completed: 6,
    inProgress: 3,
    mostActive: { name: 'Maize Season 2025', percent: 65 },
    upcoming: { goal: 'Fertilizer application', date: 'Aug 15' },
  };

  // Pie chart calculations
  const totalGoals = goalStatus.reduce((a, b) => a + b, 0);
  const pieAngles = goalStatus.map((count) => (count / totalGoals) * 360);
  let startAngle = 0;
  const pieSlices = pieAngles.map((angle, i) => {
    const endAngle = startAngle + angle;
    const largeArc = angle > 180 ? 1 : 0;
    const x1 = 60 + 50 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 60 + 50 * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 60 + 50 * Math.cos((Math.PI * endAngle) / 180);
    const y2 = 60 + 50 * Math.sin((Math.PI * endAngle) / 180);
    const d = `M60,60 L${x1},${y1} A50,50 0 ${largeArc} 1 ${x2},${y2} Z`;
    startAngle = endAngle;
    return <Path key={i} d={d} fill={goalColors[i]} />;
  });

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={true}>
      <View className="px-3 pt-5">
        <Text className="text-xl font-bold mb-1">Manage your agricultural projects</Text>
        {/* Project Progress Chart */}
        <View className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-100">
          <Text className="font-bold text-base mb-4">Project Progress</Text>
          <View className="bg-gray-50 rounded-xl p-2 items-center">
            <Svg width={250} height={220}>
              {/* Y axis labels */}
              {[0, 1, 2, 3].map(i => (
                <SvgText
                  key={i}
                  x={40}
                  y={40 + i * 40}
                  fontSize="11"
                  fill="#888"
                  textAnchor="end"
                >
                  {600 - i * 16}
                </SvgText>
              ))}
              {/* Dots for each project */}
              {progressData.map((val, i) => (
                <G key={i}>
                  <Circle cx={70 + i * 60} cy={40 + (65 - val) * 2} r={6} fill="#2563eb" />
                  <SvgText x={70 + i * 60} y={180} fontSize="12" fill="#222" textAnchor="middle">{progressLabels[i]}</SvgText>
                </G>
              ))}
            </Svg>
          </View>
        </View>
        {/* Goal Status Distribution Pie Chart */}
        <View className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-100">
          <Text className="font-bold text-base mb-4">Goal Status Distribution</Text>
          <View className="flex-row items-center justify-between">
            <Svg width={120} height={120} className='mt-20'>
              {pieSlices}
            </Svg>
            <View className="ml-4">
              <View className="flex-row items-center mb-1">
                <View className="w-3 h-3 rounded-full" style={{ backgroundColor: goalColors[0] }} />
                <Text className="ml-2 text-xs text-gray-700">{goalStatus[0]} Completed</Text>
              </View>
              <View className="flex-row items-center mb-1">
                <View className="w-3 h-3 rounded-full" style={{ backgroundColor: goalColors[1] }} />
                <Text className="ml-2 text-xs text-gray-700">{goalStatus[1]} In Progress</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full" style={{ backgroundColor: goalColors[2] }} />
                <Text className="ml-2 text-xs text-gray-700">{goalStatus[2]} Pending</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Project Statistics */}
        <View className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-100">
          <Text className="font-bold text-base mb-4">Project Statistics</Text>
          <View className="flex-row flex-wrap mb-4">
            <View className="w-1/2 p-2">
              <View className="bg-blue-50 rounded-lg py-3 px-2 items-center justify-center">
                <MaterialIcons name="event-available" size={20} color="#2563eb" />
                <Text className="font-bold text-lg mt-1">{stats.onTime}%</Text>
                <Text className="text-xs text-gray-500">On-Time Goals</Text>
              </View>
            </View>
            <View className="w-1/2 p-2">
              <View className="bg-blue-50 rounded-lg py-3 px-2 items-center justify-center">
                <MaterialIcons name="flag" size={20} color="#2563eb" />
                <Text className="font-bold text-lg mt-1">{stats.total}</Text>
                <Text className="text-xs text-gray-500">Total Goals</Text>
              </View>
            </View>
            <View className="w-1/2 p-2">
              <View className="bg-blue-50 rounded-lg py-3 px-2 items-center justify-center">
                <MaterialIcons name="check-circle" size={20} color="#22c55e" />
                <Text className="font-bold text-lg mt-1">{stats.completed}</Text>
                <Text className="text-xs text-gray-500">Completed</Text>
              </View>
            </View>
            <View className="w-1/2 p-2">
              <View className="bg-blue-50 rounded-lg py-3 px-2 items-center justify-center">
                <MaterialIcons name="autorenew" size={20} color="#fb923c" />
                <Text className="font-bold text-lg mt-1">{stats.inProgress}</Text>
                <Text className="text-xs text-gray-500">In Progress</Text>
              </View>
            </View>
          </View>
          <View className="border-t border-gray-200 my-2" />
          <View className="flex-row items-center mt-2">
            <MaterialIcons name="star" size={20} color="#fbbf24" />
            <Text className="ml-2 text-xs text-gray-700 flex-1">Most Active Project</Text>
            <Text className="font-bold text-xs text-blue-700 mr-2">{stats.mostActive.percent}%</Text>
            <Text className="font-semibold text-xs text-gray-700">{stats.mostActive.name}</Text>
          </View>
          <View className="flex-row items-center mt-2">
            <MaterialIcons name="event" size={20} color="#fb923c" />
            <Text className="ml-2 text-xs text-gray-700 flex-1">Upcoming Deadline</Text>
            <Text className="font-semibold text-xs text-gray-700 mr-2">{stats.upcoming.goal}</Text>
            <Text className="font-bold text-xs text-blue-700">{stats.upcoming.date}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
