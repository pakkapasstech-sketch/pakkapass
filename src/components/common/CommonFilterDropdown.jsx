import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  HiOutlineChevronDown,
  HiOutlineCheck,
} from 'react-icons/hi';

import './commonFilterDropdown.css';

const CommonFilterDropdown = ({
  placeholder = '',
  value,
  options = [],
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [menuStyle, setMenuStyle] = useState({});

  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) {
        return;
      }

      setOpen(false);
      setSearch('');
    };

    window.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleClick, true);

    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleClick, true);
    };
  }, []);

  const toggleDropdown = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      const MENU_HEIGHT = Math.min(
        filteredOptions.length * 45 + 55,
        280
      );

      const spaceBelow = window.innerHeight - rect.bottom;
      const openAbove = spaceBelow < MENU_HEIGHT;

      setMenuStyle({
        position: 'fixed',
        left: rect.left,
        width: rect.width,
        top: openAbove
          ? rect.top - MENU_HEIGHT - 2
          : rect.bottom + 2,
        zIndex: 999999,
      });
    }

    setOpen((prev) => !prev);
  };

  return (
    <div
      className="common-dropdown"
      ref={triggerRef}
    >
      <button
        type="button"
        disabled={disabled}
        className="common-dropdown-trigger"
        onClick={toggleDropdown}
      >
        <span>{value || placeholder}</span>

        <HiOutlineChevronDown
          className={open ? 'rotate' : ''}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="common-dropdown-menu"
            style={menuStyle}
          >
            <div className="common-dropdown-search">
              <input
                placeholder={`Search ${placeholder}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="common-dropdown-options">
              {filteredOptions.length ? (
                filteredOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`common-dropdown-option ${
                      value === item ? 'selected' : ''
                    }`}
                    onClick={() => {
                      console.log("Selected:", item);
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
                ))
              ) : (
                <div className="common-dropdown-empty">
                  No results found
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default CommonFilterDropdown;