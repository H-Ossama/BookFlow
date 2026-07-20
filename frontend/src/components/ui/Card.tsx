
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Content card */
export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}
export default Card;
