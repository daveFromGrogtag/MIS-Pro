import { useState, useEffect } from "react";
import printerData from '../scripts/presses.json'

export default function PopulatedPressDropdown() {
  const [printer, setPrinter] = useState("");
  const [printMode, setPrintMode] = useState("");
  const [qualityMode, setQualityMode] = useState("");

  const printerOptions = Object.keys(printerData);
  const printModeOptions =
    printer && printerData[printer]?.print_mode
      ? Object.keys(printerData[printer].print_mode)
      : [];
  const qualityModeOptions =
    printer && printerData[printer]?.quality_mode
      ? Object.keys(printerData[printer].quality_mode)
      : [];

  useEffect(() => {
    
  }, [printer, printMode, qualityMode])

  // function handleChange(e) {

  // }

  return (
    <div>
      {/* Printer Dropdown */}
      <select
        value={printer}
        onChange={(e) => {
          setPrinter(e.target.value);
          setPrintMode("");
          setQualityMode("");
        }}
      >
        <option value="">-- Select Printer --</option>
        {printerOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Print Mode Dropdown */}
      <select
        value={printMode}
        onChange={(e) => setPrintMode(e.target.value)}
        disabled={!printer}
      >
        <option value="">-- Select Print Mode --</option>
        {printModeOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Quality Mode Dropdown */}
      <select
        value={qualityMode}
        onChange={(e) => setQualityMode(e.target.value)}
        disabled={!printer}
      >
        <option value="">-- Select Quality Mode --</option>
        {qualityModeOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Display selected values */}
      {printer && (
        <div>
          <h2>Selected Options:</h2>
          <p><strong>Printer:</strong> {printer}</p>
          <p><strong>Print Mode:</strong> {printMode}</p>
          <p><strong>Quality Mode:</strong> {qualityMode}</p>

          {printMode && (
            <p>
              <strong>Cost per sq. in.:</strong>{" "}
              {printerData[printer].print_mode[printMode].cost_per_square_inch}
            </p>
          )}

          {qualityMode && (
            <p>
              <strong>Seconds per sq. in.:</strong>{" "}
              {printerData[printer].quality_mode[qualityMode].seconds_per_square_inch}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// export default PopulatedPressDropdown