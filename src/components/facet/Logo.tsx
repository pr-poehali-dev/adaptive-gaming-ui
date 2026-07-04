interface LogoProps {
  size?: 'sm' | 'lg';
}

const Logo = ({ size = 'lg' }: LogoProps) => {
  const cls = size === 'lg'
    ? 'text-[19vw] sm:text-[15vw] md:text-[11rem] leading-none'
    : 'text-3xl leading-none';

  return (
    <span
      className={`font-display font-bold tracking-tight animate-logo-glow ${cls}`}
      style={{ color: 'hsl(var(--logo-glow))' }}
    >
      FA<span className="text-foreground">C</span>ET
    </span>
  );
};

export default Logo;
