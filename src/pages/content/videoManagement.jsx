import { useState } from 'react';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlinePlus,
} from 'react-icons/hi';

import { mockVideos } from '../../data/mockVideos';
import '../../styles/videoManagement.css';

const VideoTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 5;

  const filteredVideos = mockVideos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredVideos.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentVideos = filteredVideos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="video-management-page">
      {/* Header */}

      <div className="video-management-header">
        <div>
          <h1 className="video-management-title">
            Video Management
          </h1>

          <p className="video-management-subtitle">
            Manage educational videos and learning content
          </p>
        </div>

        <button
          className="upload-video-btn"
          onClick={() => {
            // TODO: Upload Video Modal
            console.log('Upload Video');
          }}
        >
          <HiOutlinePlus />
          Upload Video
        </button>
      </div>

      {/* Table */}

      <div className="data-table-container">
        {/* Search */}

        <div className="video-table-toolbar">
          <input
            type="text"
            placeholder="Search video name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="video-search-input"
          />
        </div>

        {/* Table */}

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr className="data-table-head-row">
                <th className="data-table-th">Thumbnail</th>
                <th className="data-table-th">Video</th>
                <th className="data-table-th">Topic</th>
                <th className="data-table-th">Class</th>
                <th className="data-table-th">Views</th>
                <th className="data-table-th">Uploaded</th>
                <th className="data-table-th">Status</th>
                <th className="data-table-th">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentVideos.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="data-table-td"
                    style={{
                      textAlign: 'center',
                      padding: '40px',
                    }}
                  >
                    No videos found
                  </td>
                </tr>
              ) : (
                currentVideos.map((video) => (
                  <tr
                    key={video.id}
                    className="data-table-row"
                  >
                    <td className="data-table-td">
                      <div className="video-thumbnail-wrapper">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="video-thumbnail"
                        />

                        <div className="play-overlay" />
                      </div>
                    </td>

                    <td className="data-table-td">
                      <div className="video-title">
                        {video.title}
                      </div>

                      <div className="video-meta">
                        {video.subject} • {video.duration}
                      </div>
                    </td>

                    <td className="data-table-td">
                      {video.topic}
                    </td>

                    <td className="data-table-td">
                      {video.className}
                    </td>

                    <td className="data-table-td">
                      {video.views.toLocaleString()}
                    </td>

                    <td className="data-table-td">
                      {video.uploadedOn}
                    </td>

                    <td className="data-table-td">
                      <span className="status-badge status-success">
                        {video.status}
                      </span>
                    </td>

                    <td className="data-table-td">
                      <div className="data-table-action-group">
                        <button className="data-table-view-btn">
                          <HiOutlineEye />
                        </button>

                        <button className="data-table-edit-btn">
                          <HiOutlinePencil />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}

        <div className="table-footer">
          <span>
            Showing{' '}
            {filteredVideos.length === 0
              ? 0
              : startIndex + 1}{' '}
            to{' '}
            {Math.min(
              startIndex + itemsPerPage,
              filteredVideos.length
            )}{' '}
            of {filteredVideos.length} videos
          </span>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
              >
                ‹
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => (
                  <button
                    key={index}
                    className={
                      currentPage === index + 1
                        ? 'active'
                        : ''
                    }
                    onClick={() =>
                      setCurrentPage(index + 1)
                    }
                  >
                    {index + 1}
                  </button>
                )
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoTable;