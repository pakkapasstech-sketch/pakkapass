import { useMemo, useState,useEffect } from 'react';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { contentService } from '../../services/content.service';
import { formatFileSize } from '../../utils/formatters';
import './contentTable.css';

const PAGE_SIZE = 5;

const ContentTable = ({
  activeTab,
  filters,
  content,
}) => {
  const [search, setSearch] =
    useState('');
  const queryClient =
  useQueryClient();
  const [page, setPage] =
    useState(1);
// console.log(content);
// console.log('CONTENT', content);
// console.log('FILTERS', filters);
// console.log('ACTIVE TAB', activeTab);
// console.log(content[0].grade);
// console.log(filters.class);
// console.log('CONTENT', content);
// console.log('FILTERS', filters);
 const filteredContent = useMemo(() => {

  

  return content.filter((item) => {
    //console.log('ITEM', item);


    
    const matchSearch =
  item.title
    ?.toLowerCase()
    .includes(search.toLowerCase());
console.log('ITEM', item);
const matchClass =
  !filters.class ||
  item.grade ===
    filters.class;

const matchBoard =
  !filters.board ||
  item.board === filters.board;
const matchCourse =
      !filters.course ||
      item.course ===
        filters.course;

const matchSubject =
  !filters.subject ||
  item.subject === filters.subject;


const matchChapter =
  !filters.chapter ||
  item.chapter === filters.chapter;

const matchSection =
  !filters.section ||
  item.section === filters.section;
const matchHierarchyType =
  !filters.selectedContentType ||
  item.hierarchyType ===
    filters.selectedContentType;

const matchType =
  activeTab === 'all'
    ? true
    : item.type === activeTab;
// console.log({
//   matchClass,
//   matchBoard,
//   matchCourse,
//   matchSubject,
//   matchChapter,
//   matchSection,
//   matchType,
// });


return (
  matchSearch &&
  matchClass &&
  matchBoard &&
  matchCourse &&
  matchSubject &&
  matchHierarchyType &&
  matchChapter &&
  matchSection &&
  matchType
);
  });
}, [
  content,
  search,
  activeTab,
  filters,
]);
useEffect(() => {
  setPage(1);
}, [
  search,
  activeTab,
  filters,
]);
  const totalPages =
    Math.ceil(
      filteredContent.length /
        PAGE_SIZE
    ) || 1;

  const paginatedContent =
    filteredContent.slice(
      (page - 1) *
        PAGE_SIZE,
      page * PAGE_SIZE
    );

  const handleDelete = async (
  id
) => {
  try {
    if (
      !window.confirm(
        'Delete this content?'
      )
    ) {
      return;
    }

    await contentService.deleteAsset(
      id
    );

    toast.success(
      'Content deleted'
    );

    queryClient.invalidateQueries(
      {
        queryKey: ['content'],
      }
    );
  } catch (error) {
    toast.error(
      error.response?.data
        ?.message ||
        'Delete failed'
    );
  }
};

  const handleEdit = async (
  item
) => {
  const title =
    window.prompt(
      'Title',
      item.title
    );

  if (
    title === null
  ) {
    return;
  }

  const description =
    window.prompt(
      'Description',
      item.description || ''
    );

  try {
    await contentService.updateAsset(
      item.id,
      {
        title,
        description,
      }
    );

    toast.success(
      'Content updated'
    );

    queryClient.invalidateQueries(
      {
        queryKey: ['content'],
      }
    );
  } catch (error) {
    toast.error(
      error.response?.data
        ?.message ||
        'Update failed'
    );
  }
};

  const handleView = (
    item
  ) => {
    if (
      item.fileUrl
    ) {
      window.open(
        item.fileUrl,
        '_blank'
      );
    }
  };

  return (
    <div className="data-table-container">
      {/* Search */}

      <div className="content-table-toolbar">
        <input
          type="text"
          placeholder="Search content..."
          className="content-search-input"
          value={search}
          onChange={(e) => {
            setSearch(
              e.target.value
            );
            setPage(1);
          }}
        />
      </div>

      {/* Table */}

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>File</th>
              <th>Uploaded On</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedContent.length ===
            0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="table-empty"
                >
                  No Content Found
                </td>
              </tr>
            ) : (
              paginatedContent.map(
                (item) => (
                  <tr
                    key={
                      item.id
                    }
                  >
                    <td>
                      {
                        item.title
                      }
                    </td>

                    <td>
                      <span
                        className={`content-type-badge ${item.type}`}
                      >
                        {
                          item.type
                        }
                      </span>
                    </td>

                    <td>
                      {item.fileUrl ? (
                        <a
                          href={
                            item.fileUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.fileName ||
                            'View File'}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td>
                      {
                        item.uploadedOn
                      }
                    </td>

                    <td>
                      {
                        formatFileSize(item.fileSize)
                      }
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() =>
                            handleView(
                              item
                            )
                          }
                        >
                          <HiOutlineEye />
                        </button>

                        <button
                          onClick={() =>
                            handleEdit(
                              item
                            )
                          }
                        >
                          <HiOutlinePencil />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                        >
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="table-pagination">
        <button
          disabled={page === 1}
          onClick={() =>
            setPage(
              page - 1
            )
          }
        >
          Previous
        </button>

        <span>
          Page {page} of{' '}
          {totalPages}
        </span>

        <button
          disabled={
            page ===
            totalPages
          }
          onClick={() =>
            setPage(
              page + 1
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ContentTable;