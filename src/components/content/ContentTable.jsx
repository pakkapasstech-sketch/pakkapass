import { useState } from 'react';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';

import { mockContent } from '../../data/mockContent';

const ContentTable = ({
  activeTab,
}) => {
  const [search, setSearch] =
    useState('');

  const filtered =
    mockContent.filter((item) => {
      const matchSearch =
        item.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchTab =
        activeTab === 'all'
          ? true
          : item.type === activeTab;

      return (
        matchSearch &&
        matchTab
      );
    });

  return (
    <div className="data-table-container">
      <div className="content-table-toolbar">
        <input
          className="vontent-search-input"
          placeholder="Search content..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr className="data-table-head-row">
              <th className="data-table-th">
                Title
              </th>

              <th className="data-table-th">
                Type
              </th>

              <th className="data-table-th">
                Uploaded On
              </th>

              <th className="data-table-th">
                File Size
              </th>

              <th className="data-table-th">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
    <tr>
      <td
        colSpan="5"
        className="data-table-td"
        style={{
          textAlign: 'center',
          padding: '60px',
        }}
      >
        No content found
      </td>
    </tr>
  ) : (filtered.map(
              (item) => (
                <tr
                  key={item.id}
                  className="data-table-row"
                >
                  <td className="data-table-td">
                    {item.title}
                  </td>

                  <td className="data-table-td">
                    <span
                      className={`content-type-badge ${item.type}`}
                    >
                      {item.type}
                    </span>
                  </td>

                  <td className="data-table-td">
                    {
                      item.uploadedOn
                    }
                  </td>

                  <td className="data-table-td">
                    {
                      item.fileSize
                    }
                  </td>

                  <td className="data-table-td">
                    <div className="data-table-action-group">
                      <button className="data-table-view-btn">
                        <HiOutlineEye />
                      </button>

                      <button className="data-table-edit-btn">
                        <HiOutlinePencil />
                      </button>

                      <button className="data-table-delete-btn">
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentTable;