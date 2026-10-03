import CricketLoader from '../../assets/loading.svg';

interface CommonLoadingBarProps {
  className?: string;
  size?: string;
}

export default function CommonLoadingBar({ className = 'w-24 h-24', size }: CommonLoadingBarProps) {
  return (
    <div className="flex items-center justify-center">
      <img src={CricketLoader} alt="Loading" className={size || className} />
    </div>
  );
}
