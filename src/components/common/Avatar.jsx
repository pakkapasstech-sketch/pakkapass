const sizes = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-10 w-10 text-sm',
};

const Avatar = ({ initials, size = 'md', className = '' }) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizes[size]} ${className}`}
    style={{ backgroundColor: 'var(--color-primary)' }}
  >
    {initials}
  </div>
);

export default Avatar;