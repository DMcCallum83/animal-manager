interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="input-container">
      {label && (
        <label className="input-label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <input
        className={`input ${error ? "input--error" : ""} ${className}`}
        aria-label={label}
        id={props.id}
        {...props}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
