import { useState } from 'react';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineDocumentText,
} from 'react-icons/hi';

import { mockPdfs } from '../../data/mockPdfs';
import '../../styles/pdfManagement.css';

const PdfTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 5;

  const filteredPdfs = mockPdfs.filter((pdf) =>
    pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredPdfs.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentPdfs = filteredPdfs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="data-table-container">
      <div className="pdf-table-toolbar">
        <input
          type="text"
          placeholder="Search PDF name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="pdf-search-input"
        />
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr className="data-table-head-row">
              <th className="data-table-th">PDF Name</th>
              <th className="data-table-th">Subject</th>
              <th className="data-table-th">Topic</th>
              <th className="data-table-th">Class</th>
              <th className="data-table-th">Board</th>
              <th className="data-table-th">File Size</th>
              <th className="data-table-th">Views</th>
              <th className="data-table-th">Uploaded On</th>
              <th className="data-table-th">Status</th>
              <th className="data-table-th">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentPdfs.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="data-table-td"
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                  }}
                >
                  No PDFs found
                </td>
              </tr>
            ) : (
              currentPdfs.map((pdf) => (
                <tr
                  key={pdf.id}
                  className="data-table-row"
                >
                  <td className="data-table-td">
                    <div className="pdf-info">
                      <div className="pdf-icon">
                        <HiOutlineDocumentText />
                      </div>

                      <div>
                        <div className="pdf-title">
                          {pdf.name}
                        </div>

                        <div className="pdf-meta">
                          {pdf.fileSize}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="data-table-td">
                    {pdf.subject}
                  </td>

                  <td className="data-table-td">
                    {pdf.topic}
                  </td>

                  <td className="data-table-td">
                    {pdf.className}
                  </td>

                  <td className="data-table-td">
                    {pdf.board}
                  </td>

                  <td className="data-table-td">
                    {pdf.fileSize}
                  </td>

                  <td className="data-table-td">
                    {pdf.views.toLocaleString()}
                  </td>

                  <td className="data-table-td">
                    {pdf.uploadedOn}
                  </td>

                  <td className="data-table-td">
                    <span className="status-badge status-success">
                      {pdf.status}
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

      <div className="table-footer">
        <span>
          Showing{' '}
          {filteredPdfs.length === 0
            ? 0
            : startIndex + 1}{' '}
          to{' '}
          {Math.min(
            startIndex + itemsPerPage,
            filteredPdfs.length
          )}{' '}
          of {filteredPdfs.length} PDFs
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
  );
};

export default PdfTable;