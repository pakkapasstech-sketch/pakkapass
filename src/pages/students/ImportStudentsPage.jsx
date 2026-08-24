import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUpload, HiOutlineArrowLeft, HiOutlineX, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx-js-style';
import Pagination from '../../components/tables/Pagination';
import studentService from '../../services/student.service';
import { getPlans } from '../../services/SubscriptionServices';
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
      'Parent Mobile': 'parentMobile',
      'Plan ID': 'planId',
      'PlanId': 'planId',
      'Plan id': 'planId',
      'Plan': 'planId'
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
        studentsData
      });
      toast.success('Students imported successfully!');
      navigate('/students');
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error.response?.data?.message || 'Failed to import students.');
    } finally {
      setIsUploading(false);
    }
  };

  const [availablePlans, setAvailablePlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await getPlans();
        setAvailablePlans(plans || []);
      } catch {
        setAvailablePlans([]);
      }
    };
    fetchPlans();
  }, []);

  const handleDownloadTemplate = async () => {
    let currentPlans = availablePlans;
    try {
      const fetchedPlans = await getPlans();
      if (fetchedPlans && Array.isArray(fetchedPlans)) {
        currentPlans = fetchedPlans;
        setAvailablePlans(fetchedPlans);
      }
    } catch (err) {
      console.error("Could not fetch real-time plans:", err);
    }

    // Sheet 1: Student Data (Restored to clean original header format)
    const headers = [['Name', 'Phone', 'Email', 'Grade', 'Board', 'Branch', 'Parent Name', 'Parent Mobile', 'Parent Email', 'Institute', 'State', 'District', 'City', 'Plan ID']];
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

    // Sheet 2: Available Plans (Real-time detailed standalone table)
    const planTableHeaders = [['Plan ID', 'Plan Name', 'Price (Rupees)', 'Duration (Days)', 'Type (Public / Private)', 'Category (Supply / Standard)', 'Status']];
    const planTableRows = (currentPlans || []).map((p) => [
      p.id,
      p.name || 'Unnamed Plan',
      p.price !== undefined && p.price !== null ? `₹${p.price}` : 'Free',
      p.durationDays ? `${p.durationDays} Days` : 'N/A',
      p.isPublic === false ? 'Private' : 'Public',
      p.isSupply ? 'Supply Plan' : 'Standard Plan',
      p.status || 'Active',
    ]);

    const wsPlansData = [...planTableHeaders, ...planTableRows];
    const wsPlans = XLSX.utils.aoa_to_sheet(wsPlansData);

    // Style headers for Available Plans
    for (let c = 0; c < planTableHeaders[0].length; c++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c });
      if (wsPlans[cellRef]) {
        wsPlans[cellRef].s = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    }

    // Set column widths for Available Plans
    wsPlans['!cols'] = [
      { wch: 10 }, // Plan ID
      { wch: 30 }, // Plan Name
      { wch: 16 }, // Price (Rupees)
      { wch: 16 }, // Duration (Days)
      { wch: 22 }, // Type
      { wch: 24 }, // Category
      { wch: 12 }  // Status
    ];

    // Style data cells for Available Plans
    for (let r = 1; r < wsPlansData.length; r++) {
      for (let c = 0; c < wsPlansData[r].length; c++) {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        if (wsPlans[cellRef]) {
          wsPlans[cellRef].s = {
            alignment: { vertical: "center", horizontal: c === 0 || c === 2 || c === 3 || c === 4 || c === 5 || c === 6 ? "center" : "left" }
          };
        }
      }
    }

    // Sheet 3: Instructions
    const gradesList = [...new Set((optionsData?.grades || []).map(g => g.name || g.gradeName || g.grade || g).filter(Boolean))];
    const boardsList = [...new Set((optionsData?.boards || []).map(b => b.name || b.boardName || b.board || b).filter(Boolean))];
    const branchesList = [...new Set((optionsData?.branches || optionsData?.courses || []).map(b => b.name || b.branchName || b.courseName || b.branch || b).filter(Boolean))];
    
    const plansSummaryString = currentPlans.length > 0
      ? currentPlans.map(p => {
          const typeStr = p.isPublic === false ? 'Private' : 'Public';
          const supplyStr = p.isSupply ? 'Supply Plan' : 'Standard Plan';
          const priceStr = `₹${p.price ?? 0}`;
          const daysStr = `${p.durationDays || 365} Days`;
          return `ID ${p.id}: ${p.name || 'Plan'} [${typeStr} | ${supplyStr} | ${priceStr} | ${daysStr}]`;
        }).join(' \n')
      : 'Enter subscription plan ID (e.g. 1, 2). See Available Plans sheet.';

    const gradesString = gradesList.join(', ');
    const boardsString = boardsList.join(', ');
    const branchesString = branchesList.join(', ');

    const instructionsData = [
      ['Category', 'Details / Available Options'],
      ['Available Grades', gradesString],
      ['Available Boards', boardsString],
      ['Available Branches', branchesString],
      ['Available Subscription Plans', plansSummaryString],
      ['Note for 11th Grade', 'For 11th, it is equivalent to +1 or Intermediate 1st Year'],
      ['Note for 12th Grade', 'For 12th, it is equivalent to +2 or Intermediate 2nd Year'],
      ['Format Rules', 'Name, Email, Grade, and Institute are mandatory. Plan ID is optional (must be a valid plan ID from the "Available Plans" reference table if provided).']
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
      { wch: 110 }  // Details
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
    XLSX.utils.book_append_sheet(wb, wsPlans, "Available Plans");
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
          onClick={() => {
            navigate('/students');
          }}
          disabled={isUploading}
        >
          Cancel
        </button>
        <button
          className="import-submit-btn"
          onClick={handleImport}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Processing...' : 'Submit Import'}
        </button>
      </div>
    </div>
  );
};

export default ImportStudentsPage;
