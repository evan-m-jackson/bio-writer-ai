export interface ProfileOptionsProps {
  fieldOfLawOptions: string[];
  yearOptions: number[];
  handleSelectionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  indexNum: number;
  fieldOfLaw: string;
  yearsInFieldOfLaw: string;
}

export default function ProfileOptions({
  fieldOfLawOptions,
  yearOptions,
  handleSelectionChange,
  indexNum,
  fieldOfLaw,
  yearsInFieldOfLaw,
}: ProfileOptionsProps) {
  return (
    <div>
      <h2>Field of Law #{indexNum}</h2>
      <select
        id={`field-${indexNum}`}
        onChange={handleSelectionChange}
        className="text-gray-900"
        value={fieldOfLaw}
      >
        <option></option>
        {fieldOfLawOptions.map((option, idx) => (
          <option key={idx}>{option}</option>
        ))}
      </select>
      <label htmlFor={`field-${indexNum}`}>Field of Law</label>
      <label htmlFor={`years-${indexNum}`}>
        <select
          id={`years-${indexNum}`}
          onChange={handleSelectionChange}
          className="text-gray-900"
          value={yearsInFieldOfLaw}
        >
          <option></option>
          {yearOptions.map((num) => (
            <option key={num}>{num}</option>
          ))}
        </select>
        Years
      </label>
    </div>
  );
}
