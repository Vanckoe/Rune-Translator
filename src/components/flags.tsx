// components/Flag.tsx
import 'flag-icons/css/flag-icons.min.css';

interface FlagProps {
  code: string;          // "kz", "us", …
  squared?: boolean;
  className?: string;
}

const Flag = ({ code, squared = false, className = '' }: FlagProps) => (
  <span className={` text-2xl fi fi-${code.toLowerCase()} ${squared ? 'fis' : ''} ${className}`} />
);

export default Flag;
