import { useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppCard, AppText } from '@/components';
import type { GrowthLog } from '@/types';
import { ageInWeeks } from '@/lib/week';
import { parseISODate } from '@/lib/dates';
import { colors, radius, spacing } from '@/theme';

type Metric = 'weight' | 'height';

interface Point {
  week: number;
  value: number;
}

interface MetricConfig {
  key: Metric;
  label: string;
  unit: string;
  accessor: (g: GrowthLog) => number | null;
  example: Point[];
  format: (v: number) => string;
}

const METRICS: Record<Metric, MetricConfig> = {
  weight: {
    key: 'weight',
    label: 'Vikt',
    unit: 'kg',
    accessor: (g) => g.weightKg,
    example: [
      { week: 9, value: 4.6 },
      { week: 10, value: 5.5 },
      { week: 11, value: 6.5 },
      { week: 12, value: 7.4 },
    ],
    format: (v) => `${String(Math.round(v * 10) / 10).replace('.', ',')} kg`,
  },
  height: {
    key: 'height',
    label: 'Mankhöjd',
    unit: 'cm',
    accessor: (g) => g.withersHeightCm,
    example: [
      { week: 9, value: 26 },
      { week: 10, value: 28 },
      { week: 11, value: 30 },
      { week: 12, value: 32 },
    ],
    format: (v) => `${Math.round(v)} cm`,
  },
};

const CHART_HEIGHT = 150;
const PAD = { top: 14, right: 8, bottom: 4, left: 8 };

interface GrowthChartCardProps {
  history: GrowthLog[];
  dateOfBirth: string;
}

/**
 * Premium growth chart. Weight and withers height have separate scales (toggle),
 * since they use different units. The curve is drawn from the owner's own logged
 * points; while there are fewer than two real points we show a clearly labelled
 * example so the design reads, without pretending the example is their data.
 */
export function GrowthChartCard({ history, dateOfBirth }: GrowthChartCardProps) {
  const [metric, setMetric] = useState<Metric>('weight');
  const [width, setWidth] = useState(0);
  const cfg = METRICS[metric];

  const realPoints = useMemo<Point[]>(() => {
    return history
      .map((g) => {
        const value = cfg.accessor(g);
        if (value == null) return null;
        return { week: ageInWeeks(dateOfBirth, parseISODate(g.measuredAt)), value };
      })
      .filter((p): p is Point => p !== null);
  }, [history, cfg, dateOfBirth]);

  const usingExample = realPoints.length < 2;
  const points = usingExample ? cfg.example : realPoints;

  const latestReal = realPoints[realPoints.length - 1] ?? null;
  const prevReal = realPoints[realPoints.length - 2] ?? null;
  const delta = latestReal && prevReal ? latestReal.value - prevReal.value : null;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <AppCard padding="md">
      {/* Header: title + metric toggle */}
      <View style={styles.header}>
        <AppText variant="overline" color={colors.moss}>
          TILLVÄXT
        </AppText>
        <View style={styles.toggle}>
          {(['weight', 'height'] as Metric[]).map((m) => {
            const active = m === metric;
            return (
              <Pressable
                key={m}
                onPress={() => setMetric(m)}
                style={[styles.toggleItem, active && styles.toggleItemActive]}
              >
                <AppText
                  variant="caption"
                  color={active ? colors.white : colors.textMuted}
                >
                  {METRICS[m].label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Latest value + delta */}
      <View style={styles.valueRow}>
        <AppText variant="stat" color={colors.primary}>
          {latestReal
            ? cfg.format(latestReal.value)
            : `Ingen ${cfg.label.toLowerCase()} sparad ännu`}
        </AppText>
        {delta != null ? (
          <View style={[styles.deltaPill, delta < 0 && styles.deltaPillDown]}>
            <AppText
              variant="caption"
              color={delta < 0 ? colors.warning : colors.success}
            >
              {delta >= 0 ? '+' : ''}
              {cfg.format(Math.abs(delta)).replace(` ${cfg.unit}`, '')} {cfg.unit} sedan
              vecka {prevReal?.week}
            </AppText>
          </View>
        ) : null}
      </View>

      {/* Chart */}
      <View style={styles.chartWrap} onLayout={onLayout}>
        {width > 0 ? (
          <Animated.View key={`${metric}-${usingExample}`} entering={FadeIn.duration(350)}>
            <Chart points={points} width={width} muted={usingExample} />
          </Animated.View>
        ) : null}
      </View>

      {/* Week axis */}
      <View style={styles.axis}>
        <AppText variant="caption" color={colors.textMuted}>
          Vecka {points[0]?.week}
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Vecka {points[points.length - 1]?.week}
        </AppText>
      </View>

      {/* Honesty note */}
      {usingExample ? (
        <View style={styles.exampleNote}>
          <View style={styles.exampleBadge}>
            <AppText variant="overline" color={colors.textMuted}>
              EXEMPEL
            </AppText>
          </View>
          <AppText variant="caption" color={colors.textMuted} style={styles.exampleText}>
            Din kurva växer fram när du sparar {cfg.label.toLowerCase()} över flera veckor.
          </AppText>
        </View>
      ) : null}
    </AppCard>
  );
}

function Chart({
  points,
  width,
  muted,
}: {
  points: Point[];
  width: number;
  muted: boolean;
}) {
  const h = CHART_HEIGHT;
  const innerW = width - PAD.left - PAD.right;
  const innerH = h - PAD.top - PAD.bottom;

  const values = points.map((p) => p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const pad = (max - min) * 0.15;
  min -= pad;
  max += pad;

  const n = points.length;
  const x = (i: number) => PAD.left + (n === 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const y = (v: number) => PAD.top + (1 - (v - min) / (max - min)) * innerH;

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`)
    .join(' ');
  const area =
    `${line} L ${x(n - 1).toFixed(1)} ${(h - PAD.bottom).toFixed(1)}` +
    ` L ${x(0).toFixed(1)} ${(h - PAD.bottom).toFixed(1)} Z`;

  const lineColor = muted ? colors.sage : colors.primary;
  const fill = muted ? 'rgba(168,203,179,0.20)' : 'rgba(31,90,61,0.12)';

  return (
    <Svg width={width} height={h}>
      <Path d={area} fill={fill} />
      <Path d={line} stroke={lineColor} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <Circle
          key={i}
          cx={x(i)}
          cy={y(p.value)}
          r={i === n - 1 ? 5 : 3.5}
          fill={i === n - 1 ? lineColor : colors.card}
          stroke={lineColor}
          strokeWidth={2}
        />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    padding: 3,
    gap: 2,
  },
  toggleItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  toggleItemActive: { backgroundColor: colors.primary },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  deltaPill: {
    backgroundColor: '#EAF3EC',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  deltaPillDown: { backgroundColor: '#F6EBDF' },
  chartWrap: { marginTop: spacing.md, height: CHART_HEIGHT },
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  exampleNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.border,
  },
  exampleBadge: {
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  exampleText: { flexShrink: 1 },
});
