const sizes = { sm: 'h-7 w-7 text-[10px]', md: 'h-9 w-9 text-xs', lg: 'h-10 w-10 text-sm' };

const Avatar = ({ initials, size = 'md', className = '' }) => (
  <div className={`flex shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white ${sizes[size]} ${className}`}>
    {initials}
  </div>
);

export default Avatar;
