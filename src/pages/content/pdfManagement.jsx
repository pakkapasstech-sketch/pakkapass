import { HiOutlinePlus } from 'react-icons/hi';
import PdfTable from '../../pages/content/pdfTable';
import '../../styles/pdfManagement.css';

const PdfManagementPage = () => {
  return (
    <div className="pdf-management-page">
      <div className="pdf-header">
        <div>
          <h1>PDF Management</h1>
          <p>Manage all PDFs and study materials.</p>
        </div>

        <button
          className="upload-pdf-btn"
          onClick={() => {
            // TODO: Upload PDF Modal
            console.log('Upload PDF');
          }}
        >
          <HiOutlinePlus />
          Upload PDF
        </button>
      </div>

      <PdfTable />
    </div>
  );
};

export default PdfManagementPage;