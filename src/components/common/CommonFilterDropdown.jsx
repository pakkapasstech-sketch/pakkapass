import { useEffect, useRef, useState } from 'react';
import {
  HiOutlineChevronDown,
//   HiOutlineSearch,
  HiOutlineCheck,
} from 'react-icons/hi';

import './commonFilterDropdown.css';

const CommonFilterDropdown = ({
  placeholder,
  value,
  options = [],
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () =>
      document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="common-dropdown"
      ref={ref}
    >
      <button
        type="button"
        disabled={disabled}
        className="common-dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{value || placeholder}</span>

        <HiOutlineChevronDown
          className={open ? 'rotate' : ''}
        />
      </button>

      {open && (
        <div className="common-dropdown-menu">
          <div className="common-dropdown-search">
            {/* <HiOutlineSearch /> */}

            <input
              placeholder={`Search ${placeholder}`}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="common-dropdown-options">
            {filteredOptions.map((item) => (
              <button
                key={item}
                className={`common-dropdown-option ${
                  value === item
                    ? 'selected'
                    : ''
                }`}
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                  setSearch('');
                }}
              >
                <span>{item}</span>

                {value === item && (
                  <HiOutlineCheck />
                )}
              </button>
            ))}

            {filteredOptions.length === 0 && (
              <div className="common-dropdown-empty">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonFilterDropdown;