import { useState, useRef, useEffect } from 'react';
import {
  HiOutlineChevronDown,
  HiOutlinePlus,
  HiOutlineSearch,
} from 'react-icons/hi';

import './filterDropdown.css';

const FilterDropdown = ({
  label,
  value,
  options = [],
  disabled = false,
  onSelect,
  onAdd,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] =
    useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClick
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClick
      );
  }, []);

  const filtered =
    options.filter((item) =>
      item
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div
      className="filter-dropdown"
      ref={dropdownRef}
    >
      <button
        disabled={disabled}
        className={`filter-trigger ${
          disabled
            ? 'filter-disabled'
            : ''
        }`}
        onClick={() =>
          setOpen(!open)
        }
      >
        <span>
  {value || label}
</span>

        <HiOutlineChevronDown />
      </button>

      {open && (
        <div className="filter-menu">
          <div className="filter-search">
            <HiOutlineSearch />

            <input
              placeholder={`Search `}
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </div>

          <div className="filter-options">
            {filtered.map(
              (item) => (
                <button
                  key={item}
                  className="filter-option"
                  onClick={() => {
                    onSelect(
                      item
                    );
                    setOpen(
                      false
                    );
                  }}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <button
            className="filter-add-btn"
            onClick={() => {
              setOpen(false);
              onAdd();
            }}
          >
            <HiOutlinePlus />

            Add {label}
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;