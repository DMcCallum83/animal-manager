import "./StatMeter.scss";

interface StatMeterProps {
  value: number;
  maxValue?: number;
  statusReversed?: boolean;
}

export const StatMeter: React.FC<StatMeterProps> = ({
  value,
  maxValue = 100,
  statusReversed = false,
}) => {
  const percentage = Math.min(100, (value / maxValue) * 100);

  // Determine color class based on value
  const getColorClass = (val: number) => {
    if (statusReversed) {
      if (val <= 10) return "meter-fill--excellent";
      if (val <= 30) return "meter-fill--good";
      if (val <= 50) return "meter-fill--fair";
      return "meter-fill--poor";
    } else {
      if (val >= 90) return "meter-fill--excellent";
      if (val >= 70) return "meter-fill--good";
      if (val >= 50) return "meter-fill--fair";
      return "meter-fill--poor";
    }
  };

  const colorClass = getColorClass(value);

  return (
    <div
      className="meter"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={maxValue}
    >
      <div
        className={`meter-fill ${colorClass}`}
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
};
