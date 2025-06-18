interface StatMeterProps {
  value: number;
  maxValue?: number;
  color?: string;
}

export const StatMeter: React.FC<StatMeterProps> = ({
  value,
  maxValue = 100,
  color = "#4caf50",
}) => {
  const percentage = Math.min(100, (value / maxValue) * 100);

  // Determine color based on value
  const getColor = (val: number) => {
    if (val >= 80) return "#4caf50"; // Green for good
    if (val >= 60) return "#ff9800"; // Orange for fair
    return "#f44336"; // Red for poor
  };

  const meterColor = color === "#4caf50" ? getColor(value) : color;

  return (
    <div className="meter">
      <div
        className="meter-fill"
        style={{
          width: `${percentage}%`,
          backgroundColor: meterColor,
        }}
      />
    </div>
  );
};
