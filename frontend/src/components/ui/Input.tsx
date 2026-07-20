
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/** Form input with label and error */
export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input className="border rounded-md px-3 py-2" {...props} />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
export default Input;
