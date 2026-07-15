import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUpload, HiOutlineArrowLeft, HiOutlineX, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import Pagination from '../../components/tables/Pagination';
import '../../styles/import-students.css';
import '../../styles/table.css';
import '../../styles/student-table.css';

const ImportStudentsPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [previewData, setPreviewData] = useState([]);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (file) {
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
      const isValidExtension = file.name.endsWith('.csv') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx');
      
      if (!validTypes.includes(file.type) && !isValidExtension) {
        toast.error('Please upload a valid Excel or CSV file.');
        setSelectedFile(null);
        setPreviewData([]);
        setPreviewHeaders([]);
        return;
      }
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target.result;
          const workbook = XLSX.read(bstr, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          
          if (data && data.length > 0) {
            setPreviewHeaders(data[0] || []);
            setPreviewData(data.slice(1).filter(row => row.length > 0)); // Remove empty rows
            setCurrentPage(1);
          }
        } catch (error) {
          console.error("Error parsing file:", error);
          toast.error("Failed to parse the file.");
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first.');
      return;
    }

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Students imported successfully! (Simulation)');
      navigate('/students');
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    const headers = ['Name', 'Email', 'Mobile', 'Class', 'Board', 'Institution', 'Parent Name', 'Parent Email', 'Parent Mobile'];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="import-page-container">
      <div className="import-header">
        <div className="import-header-left">
          <button 
            className="import-back-btn"
            onClick={() => navigate('/students')}
          >
            <HiOutlineArrowLeft />
          </button>
          <div>
            <h1 className="import-title">Import Students</h1>
            <p className="import-subtitle">Upload an Excel or CSV file to import student records.</p>
          </div>
        </div>
        <button 
          className="import-download-btn"
          onClick={handleDownloadTemplate}
        >
          <HiOutlineDownload />
          Download Excel Format
        </button>
      </div>

      <div className="import-card">
        <div 
          className={`import-dropzone ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <HiOutlineUpload className="import-icon" />
          <h3>
            Choose a file or drag & drop it here
          </h3>
          <p>
            Excel or CSV formats up to 10MB
          </p>
          
          <input 
            type="file" 
            id="file-upload" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileChange}
            className="import-file-input"
          />
          <label 
            htmlFor="file-upload" 
            className="import-browse-btn"
          >
            Browse File
          </label>
        </div>

        {selectedFile && (
          <div className="import-selected-file">
            <p>
              Selected File: <span>{selectedFile.name}</span>
            </p>
            <button 
              className="import-remove-btn" 
              onClick={() => {
                setSelectedFile(null);
                setPreviewData([]);
                setPreviewHeaders([]);
              }}
              title="Remove file"
            >
              <HiOutlineX />
            </button>
          </div>
        )}
      </div>

      {previewData.length > 0 && (
        <div className="import-preview-section" style={{ marginTop: '24px', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-surface)', width: '100%' }}>
          <h3 style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', fontSize: '16px', fontWeight: '600' }}>
            Data Preview ({previewData.length} records found)
          </h3>
          <div className="student-table-wrapper">
            <table className="student-table" style={{ margin: 0, width: '100%', minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  {previewHeaders.map((header, index) => (
                    <th key={index}>{header || `Column ${index + 1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>{(currentPage - 1) * itemsPerPage + rowIndex + 1}</td>
                      {previewHeaders.map((_, colIndex) => (
                        <td key={colIndex}>{row[colIndex] !== undefined ? String(row[colIndex]) : ''}</td>
                      ))}
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
            <Pagination 
              page={currentPage} 
              totalPages={Math.ceil(previewData.length / itemsPerPage)} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      )}

      <div className="import-actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '16px', width: '100%' }}>
        <button 
          className="import-cancel-btn"
          onClick={() => navigate('/students')}
          disabled={isUploading}
        >
          Cancel
        </button>
        <button 
          className="import-submit-btn"
          onClick={handleImport}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Importing...' : 'Import Students'}
        </button>
      </div>
    </div>
  );
};

export default ImportStudentsPage;
