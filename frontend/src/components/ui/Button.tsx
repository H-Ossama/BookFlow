import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

/** Reusable button with variants */
export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button className={clsx('px-4 py-2 rounded-md font-medium', className)} {...props} />
  );
}
export default Button;
