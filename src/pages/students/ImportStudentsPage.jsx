import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUpload, HiOutlineArrowLeft, HiOutlineX, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx-js-style';
import Pagination from '../../components/tables/Pagination';
import studentService from '../../services/student.service';
import { useStudentFilterOptions } from '../../hooks/useStudents';
import '../../styles/import-students.css';
import '../../styles/table.css';
import '../../styles/student-table.css';

const ImportStudentsPage = () => {
  const navigate = useNavigate();
  const { data: optionsData } = useStudentFilterOptions();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [previewData, setPreviewData] = useState([]);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [step, setStep] = useState(1);
  const [planDetails, setPlanDetails] = useState({
    name: '',
    durationDays: 365,
    price: 0
  });

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

    if (step === 1) {
      setStep(2);
      return;
    }

    if (!planDetails.name || !planDetails.durationDays) {
      toast.error('Please provide valid plan details.');
      return;
    }

    setIsUploading(true);
    
    // Convert previewData (array of arrays) into an array of objects
    const headerMapping = {
      'Name': 'name',
      'Email': 'email',
      'Mobile': 'mobile',
      'Phone': 'mobile',
      'Phone Number': 'mobile',
      'Class': 'class',
      'Grade': 'class',
      'Board': 'board',
      'Branch': 'branch',
      'Institution': 'institution',
      'Institute': 'institution',
      'State': 'state',
      'District': 'district',
      'City': 'city',
      'Parent Name': 'parentName',
      'Parent Email': 'parentEmail',
      'Parent Mobile': 'parentMobile'
    };

    const studentsData = previewData.map(row => {
      const studentObj = {};
      previewHeaders.forEach((header, index) => {
        const mappedHeader = headerMapping[header] || header.toLowerCase().replace(/\s+(.)/g, match => match[1].toUpperCase());
        studentObj[mappedHeader] = row[index];
      });
      return studentObj;
    });

    try {
      await studentService.importStudents({
        studentsData,
        planDetails
      });
      toast.success('Students imported and plan created successfully!');
      navigate('/students');
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error.response?.data?.message || 'Failed to import students.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [['Name', 'Phone', 'Email', 'Grade', 'Board', 'Branch', 'Parent Name', 'Parent Mobile', 'Parent Email', 'Institute', 'State', 'District', 'City']];
    const ws1 = XLSX.utils.aoa_to_sheet(headers);

    // Style headers for Student Data
    for (let c = 0; c < headers[0].length; c++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c });
      if (!ws1[cellRef]) continue;
      ws1[cellRef].s = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
    ws1['!cols'] = Array(headers[0].length).fill({ wch: 20 });

    const gradesList = [...new Set((optionsData?.grades || []).map(g => g.name || g.gradeName || g.grade || g).filter(Boolean))];
    const boardsList = [...new Set((optionsData?.boards || []).map(b => b.name || b.boardName || b.board || b).filter(Boolean))];
    const branchesList = [...new Set((optionsData?.branches || optionsData?.courses || []).map(b => b.name || b.branchName || b.courseName || b.branch || b).filter(Boolean))];

    const gradesString = gradesList.join(', ');
    const boardsString = boardsList.join(', ');
    const branchesString = branchesList.join(', ');

    const instructionsData = [
      ['Category', 'Details / Available Options'],
      ['Available Grades', gradesString],
      ['Available Boards', boardsString],
      ['Available Branches', branchesString],
      ['Note for 11th Grade', 'For 11th, it is equivalent to +1 or Intermediate 1st Year'],
      ['Note for 12th Grade', 'For 12th, it is equivalent to +2 or Intermediate 2nd Year'],
      ['Note for 10th Grade and Below', 'Leave the branch column blank']
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(instructionsData);

    // Style headers for Instructions
    for (let c = 0; c < instructionsData[0].length; c++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c });
      if (!ws2[cellRef]) continue;
      ws2[cellRef].s = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // Set column widths for Instructions
    ws2['!cols'] = [
      { wch: 30 }, // Category
      { wch: 100 }  // Details
    ];

    // Style data cells for Instructions
    for (let r = 1; r < instructionsData.length; r++) {
      for (let c = 0; c < instructionsData[r].length; c++) {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        if (!ws2[cellRef]) continue;
        ws2[cellRef].s = {
          alignment: { vertical: "center", wrapText: true }
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "Student Data");
    XLSX.utils.book_append_sheet(wb, ws2, "Instructions");

    XLSX.writeFile(wb, "student_import_template.xlsx");
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

      {step === 1 && previewData.length > 0 && (
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

      {step === 2 && (
        <div className="import-preview-section" style={{ marginTop: '24px', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-surface)', width: '100%', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Step 2: Create Subscription Plan</h3>
          <p style={{ marginBottom: '24px', color: 'var(--color-text-secondary)' }}>
            Provide plan details for this imported batch. All {previewData.length} students will be subscribed to this plan.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Plan Name</label>
              <input 
                type="text" 
                value={planDetails.name}
                onChange={(e) => setPlanDetails(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Batch 2026 Yearly Plan"
                style={{ padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Duration (Days)</label>
              <input 
                type="number" 
                value={planDetails.durationDays}
                onChange={(e) => setPlanDetails(prev => ({ ...prev, durationDays: parseInt(e.target.value) || 0 }))}
                style={{ padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Price (Optional)</label>
              <input 
                type="number" 
                value={planDetails.price}
                onChange={(e) => setPlanDetails(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                style={{ padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="import-actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '16px', width: '100%' }}>
        <button 
          className="import-cancel-btn"
          onClick={() => {
            if (step === 2) setStep(1);
            else navigate('/students');
          }}
          disabled={isUploading}
        >
          {step === 2 ? 'Back' : 'Cancel'}
        </button>
        <button 
          className="import-submit-btn"
          onClick={handleImport}
          disabled={!selectedFile || isUploading || (step === 2 && !planDetails.name)}
        >
          {isUploading ? 'Processing...' : (step === 1 ? 'Next: Create Plan' : 'Submit Import')}
        </button>
      </div>
    </div>
  );
};

export default ImportStudentsPage;
