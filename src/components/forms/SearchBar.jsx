import { HiOutlineSearch } from 'react-icons/hi';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => (
  <div className={`search-wrapper ${className}`}>
    <HiOutlineSearch className="search-icon" />

    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="search-input"
    />
  </div>
);

export default SearchBar;