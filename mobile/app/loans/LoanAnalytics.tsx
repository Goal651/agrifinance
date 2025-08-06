import { useLoan } from '@/contexts/LoanContext';
import { useMemo } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { Circle, Path, Svg, Text as SvgText } from 'react-native-svg';

export default function LoanAnalytics() {
  const { loanAnalytics } = useLoan();

  // Calculate stats based on the new interface
  const stats = useMemo(() => {
    if (!loanAnalytics) {
      return {
        totalLoans: 0,
        totalAmountBorrowed: 0,
        totalAmountRepaid: 0,
        totalInterestPaid: 0,
        activeLoans: 0,
        overdueLoans: 0,
        defaultRate: 0,
        averageLoanAmount: 0,
        averageLoanTerm: 0,
      };
    }
    
    return {
      ...loanAnalytics,
      // Calculate any derived stats if needed
    };
  }, [loanAnalytics]);

  // Calculate total and percentages for the donut chart
  const total = stats.totalAmountBorrowed;
  const principalPercent = total ? (stats.totalAmountRepaid / total) * 100 : 0;
  const interestPercent = stats.totalInterestPaid > 0 ? 
    (stats.totalInterestPaid / total) * 100 : 
    0;

  // Use monthly trend data for the chart
  const chartData = useMemo(() => {
    if (!loanAnalytics?.monthlyTrend?.length) return [0];
    
    // Calculate running balance of amount approved minus amount repaid
    let runningBalance = 0;
    return loanAnalytics.monthlyTrend.map(month => {
      runningBalance += (month.amountApproved - month.amountRepaid);
      return Math.max(0, runningBalance); // Ensure balance doesn't go below 0
    });
  }, [loanAnalytics]);

  // X axis labels from monthly trend
  const xAxisLabels = useMemo(() => {
    if (!loanAnalytics?.monthlyTrend?.length) return [];
    return loanAnalytics.monthlyTrend.map((month, i) => 
      (i % 3 === 0) ? month.month.substring(5) : ''
    ).filter(Boolean);
  }, [loanAnalytics]);

  // Chart dimensions and calculations
  const windowWidth = Dimensions.get('window').width;
  const chartWidth = Math.max(Math.min(windowWidth - 32, 400), 220);
  const chartHeight = 180;
  
  // Handle empty or single-value data
  const minY = chartData.length > 0 ? Math.min(...chartData) : 0;
  const maxY = chartData.length > 0 ? Math.max(...chartData, 1) : 1; // Ensure maxY is at least 1
  
  const yRange = maxY - minY || 1;
  const yPad = yRange * 0.1;
  const yMin = Math.max(0, minY - yPad); // Don't go below 0 for loan balance
  const yMax = maxY + yPad;
  const yDisplayRange = yMax - yMin || 1;
  
  // Generate points for the chart
  const points = chartData.map((value, index) => {
    const x = (index / (chartData.length - 1 || 1)) * (chartWidth - 60) + 30;
    const y = ((yMax - value) / yDisplayRange) * (chartHeight - 60) + 30;
    return { x, y };
  });
  
  // Generate SVG paths
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1]?.x || 30},${chartHeight - 30} L${points[0]?.x || 30},${chartHeight - 30} Z`;

  // Donut chart
  const donutRadius = 48;
  const donutStroke = 12;
  const principalAngle = (principalPercent / 100) * 360;
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };
  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    color: string
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
    return (
      <Path
        d={`M${start.x},${start.y} A${radius},${radius} 0 ${arcSweep} 0 ${end.x},${end.y}`}
        stroke={color}
        strokeWidth={donutStroke}
        fill="none"
      />
    );
  };

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={true}>
      <View className="px-3 pt-5">
        <Text className="text-xl font-bold mb-1">Welcome, Farmer</Text>
        <Text className="text-gray-500 mb-3">Access agricultural financing with ease</Text>
        {/* Loan Balance Over Time */}
        <View className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-100">
          <Text className="font-bold text-base mb-4">Loan Balance Over Time</Text>
          <View className="bg-gray-50 rounded-xl p-2 items-center">
            <Svg width={chartWidth} height={chartHeight}>
              {/* Area fill */}
              <Path d={areaPath} fill="#bbf7d0" opacity={0.5} />
              {/* Line */}
              <Path d={linePath} stroke="#15803d" strokeWidth={2} fill="none" />
              {/* Legend */}
              <Circle cx={50} cy={30} r={7} fill="#15803d" />
              <SvgText x={65} y={36} fontSize="14" fill="#222">Loan Balance</SvgText>
              {/* Y axis labels */}
              {[0, 1, 2, 3, 4].map(i => (
                <SvgText
                  key={i}
                  x={10}
                  y={30 + i * ((chartHeight - 60) / 4)}
                  fontSize="13"
                  fill="#888"
                >
                  {Math.round(yMax - (yDisplayRange / 4) * i)}
                </SvgText>
              ))}
              {/* X axis labels: only every 5th label shown */}
              {points.map((p, i) => 
                xAxisLabels[i] ? (
                  <SvgText
                    key={`xlabel-${i}`}
                    x={p.x}
                    y={chartHeight - 10}
                    fontSize="13"
                    fill="#888"
                    textAnchor="middle"
                  >
                    {xAxisLabels[i]}
                  </SvgText>
                ) : null
              )}
            </Svg>
          </View>
        </View>
        {/* Loan Statistics */}
        <View className="bg-gray-50 rounded-xl shadow p-4 mb-4 border border-gray-100">
          <Text className="font-bold text-base mb-4">Loan Statistics</Text>
          <View className="flex-row flex-wrap justify-between mb-4 gap-y-3">
            <View className="w-1/2 p-2">
              <View className="bg-white rounded-lg py-3 px-2 items-center justify-center">
                <Text className="text-xs text-gray-500 mb-1">Interest Paid</Text>
                <Text className="font-bold text-lg">${stats.totalInterestPaid.toLocaleString()}</Text>
              </View>
            </View>
            <View className="w-1/2 p-2">
              <View className="bg-white rounded-lg py-3 px-2 items-center justify-center">
                <Text className="text-xs text-gray-500 mb-1">Principal Paid</Text>
                <Text className="font-bold text-lg">${stats.totalAmountRepaid.toLocaleString()}</Text>
              </View>
            </View>
            <View className="w-1/2 p-2">
              <View className="bg-white rounded-lg py-3 px-2 items-center justify-center">
                <Text className="text-xs text-gray-500 mb-1">Remaining Interest</Text>
                <Text className="font-bold text-lg">${stats.totalInterestPaid.toLocaleString()}</Text>
              </View>
            </View>
            <View className="w-1/2 p-2">
              <View className="bg-white rounded-lg py-3 px-2 items-center justify-center">
                <Text className="text-xs text-gray-500 mb-1">Remaining Principal</Text>
                <Text className="font-bold text-lg">${stats.totalAmountBorrowed.toLocaleString()}</Text>
              </View>
            </View>
          </View>
          <View className="border-t border-gray-200 my-2" />
          {/* Donut chart and legend */}
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <View className="w-3 h-3 rounded-full bg-green-700 mr-2" />
                <Text className="text-xs text-gray-700">Principal ({Math.round(principalPercent)}%)</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-orange-400 mr-2" />
                <Text className="text-xs text-gray-700">Interest ({Math.round(interestPercent)}%)</Text>
              </View>
            </View>
            <View className="items-center">
              <Svg width={110} height={110}>
                {/* Principal arc */}
                {describeArc(55, 55, donutRadius, 0, principalAngle, '#15803d')}
                {/* Interest arc */}
                {describeArc(55, 55, donutRadius, principalAngle, 360, '#fb923c')}
                {/* Center circle */}
                <Circle cx={55} cy={55} r={donutRadius - donutStroke} fill="#fff" />
                <SvgText x={55} y={55} fontSize="18" fill="#15803d" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
                  ${total.toLocaleString()}
                </SvgText>
                <SvgText x={55} y={72} fontSize="12" fill="#888" textAnchor="middle">Total</SvgText>
              </Svg>
            </View>
          </View>
        </View>
      </View>
      {/* --- GRAPH DATA HANDLING NOTES ---
        The graph uses the following data and logic:
        - Y axis: Shows loan balance (amount remaining to be paid) at each point in time. Units are in currency (e.g., USD).
        - X axis: Shows payment sequence (or time), labeled as #1, #2, ... or by month if available. Each point represents a payment event.
        - Only every 5th X axis label is shown for clarity. For very large data, aggregate or downsample as needed.
        - The line graph connects all points (no dots shown for each payment).
        - Y-axis is padded for clarity, and scales to min/max of the data
        - If all balances are similar, y-axis will still show a small range for visual separation
      */}
    </ScrollView>
  );
}
