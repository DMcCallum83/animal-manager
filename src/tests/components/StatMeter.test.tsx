import { render, screen } from "@testing-library/react";
import { StatMeter } from "../../components/animals/StatMeter";

describe("StatMeter", () => {
  it("should render with default props", () => {
    render(<StatMeter value={50} />);

    const meter = screen.getByRole("meter");
    expect(meter).toBeInTheDocument();
  });

  it("should calculate correct percentage", () => {
    render(<StatMeter value={75} maxValue={100} />);

    const meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveStyle({ width: "75%" });
  });

  it("should cap percentage at 100%", () => {
    render(<StatMeter value={150} maxValue={100} />);

    const meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveStyle({ width: "100%" });
  });

  it("should apply correct color classes for normal status", () => {
    const { rerender } = render(<StatMeter value={95} />);

    let meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveClass("meter-fill--excellent");

    rerender(<StatMeter value={75} />);
    meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveClass("meter-fill--good");

    rerender(<StatMeter value={55} />);
    meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveClass("meter-fill--fair");

    rerender(<StatMeter value={25} />);
    meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveClass("meter-fill--poor");
  });

  it("should apply correct color classes for reversed status", () => {
    const { rerender } = render(<StatMeter value={5} statusReversed />);

    let meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveClass("meter-fill--excellent");

    rerender(<StatMeter value={25} statusReversed />);
    meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveClass("meter-fill--good");

    rerender(<StatMeter value={45} statusReversed />);
    meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveClass("meter-fill--fair");

    rerender(<StatMeter value={75} statusReversed />);
    meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveClass("meter-fill--poor");
  });

  it("should use custom maxValue", () => {
    render(<StatMeter value={50} maxValue={200} />);

    const meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveStyle({ width: "25%" });
  });

  it("should handle zero value", () => {
    render(<StatMeter value={0} />);

    const meterFill = document.querySelector(".meter-fill");
    expect(meterFill).toHaveStyle({ width: "0%" });
  });
});
