import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../lib/theme';

interface ArcProgressProps {
  progress: number; // 0-100
  size: number;
  strokeWidth: number;
  color: string;
  children?: React.ReactNode;
}

export function ArcProgress({ progress, size, strokeWidth, color, children }: ArcProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.background.tertiary}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        {children}
      </View>
    </View>
  );
}

interface BarChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarChartData[];
  height: number;
  showLabels?: boolean;
  showValues?: boolean;
}

export function BarChart({ data, height, showLabels = true, showValues = true }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 100);

  return (
    <View style={[styles.barChartContainer, { height: height + 24 }]}>
      <View style={[styles.barChartBars, { height }]}>
        {data.map((item, index) => (
          <View key={index} style={styles.barColumn}>
            <View style={styles.barWrapper}>
              {showValues && (
                <Text style={styles.barValue}>{Math.round(item.value)}%</Text>
              )}
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
            {showLabels && (
              <Text style={styles.barLabel}>{item.label}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

interface LineChartProps {
  data: number[];
  labels: string[];
  height: number;
  color: string;
  showDots?: boolean;
  fillGradient?: boolean;
}

export function LineChart({ data, labels, height, color, showDots = true, fillGradient = false }: LineChartProps) {
  const width = 300;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const minValue = Math.min(...data) - 1;
  const maxValue = Math.max(...data) + 1;
  const range = maxValue - minValue;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
    return { x, y };
  });

  const pathD = points.reduce((path, point, index) => {
    return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
  }, '');

  const areaD = pathD + ` L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <View style={{ height, width: '100%' }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {fillGradient && (
          <Defs>
            <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity="0.3" />
              <Stop offset="1" stopColor={color} stopOpacity="0" />
            </LinearGradient>
          </Defs>
        )}
        {fillGradient && (
          <Path d={areaD} fill="url(#gradient)" />
        )}
        <Path d={pathD} stroke={color} strokeWidth={2} fill="none" />
        {showDots && points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={color}
          />
        ))}
      </Svg>
      <View style={styles.lineChartLabels}>
        {labels.map((label, index) => (
          <Text key={index} style={styles.lineChartLabel}>{label}</Text>
        ))}
      </View>
    </View>
  );
}

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color = colors.accent.primary, height = 8 }: ProgressBarProps) {
  return (
    <View style={[styles.progressBarBg, { height }]}>
      <View
        style={[
          styles.progressBarFill,
          {
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  barChartContainer: {
    width: '100%',
  },
  barChartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    width: '60%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barValue: {
    color: colors.text.tertiary,
    fontSize: 10,
    marginBottom: 4,
  },
  barLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    marginTop: 4,
  },
  lineChartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  lineChartLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
  },
  progressBarBg: {
    width: '100%',
    backgroundColor: colors.background.tertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    borderRadius: 4,
  },
});
