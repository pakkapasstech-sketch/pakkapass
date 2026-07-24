import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiArrowLeft,
  HiOutlineClipboardCopy,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineDownload,
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx-js-style';

import '../../styles/partnerDetails.css';
import '../../styles/table.css';
import '../../styles/student-table.css';

import { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useLoading } from '../../contexts/LoadingContext';
import partnerService from '../../services/partner.service';
import { usePartner } from '../../hooks/usePartners';
import paymentService from '../../services/payment.service';

const PartnerDetailsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setLoading } = useLoading();
  const { id } = useParams();
  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(partner.referralCode || '');
      toast.success('Referral code copied');
    } catch {
      toast.error('Failed to copy referral code');
    }
  };
  const { data: res, isLoading: pageLoading } = usePartner(id);
  const partner = res?.partner;
  const analytics = res?.analytics;
  const referredStudents = res?.referredStudents || [];
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const allPayments = await paymentService.getAll();
        const partnerPayments = allPayments.filter(
          (p) =>
            p.partnerId === Number(id) ||
            (partner && p.couponCode === partner.referralCode)
        );
        setPayments(partnerPayments);
      } catch (err) {
        console.error('Failed to load payments for partner:', err);
      }
    };
    if (partner) {
      loadPayments();
    }
  }, [partner, id]);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    setLoading(pageLoading);
    return () => setLoading(false);
  }, [pageLoading, setLoading]);

  useEffect(() => {
    setCurrentPage(1);
  }, [referredStudents]);

  const totalStudents = referredStudents.length;
  const totalPages = Math.ceil(totalStudents / studentsPerPage) || 1;
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = referredStudents.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(currentPage + 2, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const calculateActualRevenue = () => {
    return payments
      .filter((p) => p.status === 'Success')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  };

  const handleExportExcel = () => {
    if (!partner) return;
    
    const wsData = [];
    
    // 1. Partner Details
    wsData.push(["PARTNER DETAILS"]);
    wsData.push(["Organization Name", partner.organizationName || 'N/A']);
    wsData.push(["Institution", partner.institutionType || 'N/A']);
    wsData.push(["Contact Person", partner.contactPerson || 'N/A']);
    wsData.push(["Email", partner.email || 'N/A']);
    wsData.push(["Mobile", partner.mobile || 'N/A']);
    wsData.push(["Referral Code", partner.referralCode || 'N/A']);
    wsData.push(["Total Students", analytics?.students?.totalStudents || 0]);
    wsData.push(["Total Revenue", calculateActualRevenue() || 0]);
    
    // 2. White Line
    wsData.push([]);
    
    // 3. Students
    wsData.push(["STUDENTS UNDER PARTNER"]);
    if (referredStudents && referredStudents.length > 0) {
      wsData.push(["S.No", "Name", "Email", "Mobile", "Current Plan", "Registered On", "Expiry Date"]);
      referredStudents.forEach((rs, index) => {
        const studentName = rs.student?.name || "N/A";
        const email = rs.student?.email || "N/A";
        const mobile = rs.student?.mobile || "N/A";
        const currentPlan = rs.plan?.name || (rs.currentPlanId ? 'Subscribed' : (rs.freeTrialStartDate ? 'Free Trial' : 'None'));
        const registeredOn = rs.student?.createdAt ? new Date(rs.student.createdAt).toLocaleDateString('en-IN') : "N/A";
        const expiryDate = rs.planExpiryDate ? new Date(rs.planExpiryDate).toLocaleDateString('en-IN') : "N/A";

        wsData.push([
          index + 1,
          studentName,
          email,
          mobile,
          currentPlan,
          registeredOn,
          expiryDate
        ]);
      });
    } else {
      wsData.push(["No students referred yet."]);
    }
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Apply bold styling to headers
    const headerRow1 = 0; // PARTNER DETAILS
    const studentHeaderTitleRow = 10; // STUDENTS UNDER PARTNER
    const studentHeaderRow = 11; // S.No, Name, etc.
    
    const boldStyle = { font: { bold: true, color: { rgb: "000000" } } };

    // Partner Details Title
    if (ws[XLSX.utils.encode_cell({ r: headerRow1, c: 0 })]) {
      ws[XLSX.utils.encode_cell({ r: headerRow1, c: 0 })].s = boldStyle;
    }
    // Partner Details labels
    for (let r = 1; r <= 8; r++) {
      if (ws[XLSX.utils.encode_cell({ r, c: 0 })]) {
        ws[XLSX.utils.encode_cell({ r, c: 0 })].s = boldStyle;
      }
    }

    // Students Title
    if (ws[XLSX.utils.encode_cell({ r: studentHeaderTitleRow, c: 0 })]) {
      ws[XLSX.utils.encode_cell({ r: studentHeaderTitleRow, c: 0 })].s = boldStyle;
    }
    
    // Students headers
    if (referredStudents && referredStudents.length > 0) {
      for (let c = 0; c <= 6; c++) {
        const cellAddress = XLSX.utils.encode_cell({ r: studentHeaderRow, c });
        if (ws[cellAddress]) {
          ws[cellAddress].s = boldStyle;
        }
      }
    }
    
    // Optional styling for columns width
    ws['!cols'] = [
      { wch: 20 }, // A
      { wch: 30 }, // B
      { wch: 30 }, // C
      { wch: 15 }, // D
      { wch: 20 }, // E
      { wch: 15 }, // F
      { wch: 15 }  // G
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Partner Details");
    
    XLSX.writeFile(wb, `Partner_${partner.organizationName || partner.contactPerson}_Details.xlsx`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${partner.organizationName || partner.contactPerson || 'this partner'}?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await partnerService.delete(id);
      await queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner deleted successfully');
      navigate('/partners');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete partner');
    } finally {
      setLoading(false);
    }
  };

  if (!partner) return null;
  return (
    <div className="partner-details-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        <HiArrowLeft />
        <span>Back to partners</span>
      </button>
      <div className="details-header">
        <div className="header-content">
          <h1>{partner.contactPerson}</h1>

          <p>{partner.partnerId}</p>
        </div>

        <div className="details-actions">
          <button className="btn-secondary" onClick={handleExportExcel} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: '#fff', color: '#374151', cursor: 'pointer', fontWeight: '500' }}>
            <HiOutlineDownload size={18} />
            Export
          </button>
          
          <button className="btn-primary" onClick={() => navigate(`/partners/${partner.id}/edit`)}>
            <HiOutlinePencil />
            Edit
          </button>

          <button className="btn-danger" onClick={handleDelete}>
            <HiOutlineTrash />
            Delete
          </button>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <h3>Partner Information</h3>

          <p>
            <span>Organization Name</span>

            <strong>{partner.organizationName || '—'}</strong>
          </p>

          <p>
            <span>Institution</span>

            <strong>{partner.institutionType}</strong>
          </p>

          <p>
            <span>Status</span>

            <strong>{partner.status}</strong>
          </p>

          <p>
            <span>Joined</span>

            <strong>{partner.joiningDate}</strong>
          </p>
        </div>

        <div className="detail-card">
          <h3>Contact Information</h3>

          <p>
            <span>Name</span>

            <strong>{partner.contactPerson}</strong>
          </p>

          <p>
            <span>Mobile</span>

            <strong>{partner.mobile}</strong>
          </p>

          <p>
            <span>Email</span>

            <strong>{partner.email}</strong>
          </p>
        </div>

        <div className="detail-card">
          <h3>Referral Details</h3>

          <p>
            <span>Code</span>

            <strong
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {partner.referralCode}

              <HiOutlineClipboardCopy
                size={18}
                style={{
                  cursor: 'pointer',
                  color: '#6653AF',
                }}
                title="Copy referral code"
                onClick={copyReferralCode}
              />
            </strong>
          </p>
          <p>
            <span>Students</span>

            <strong>{analytics?.students?.totalStudents}</strong>
          </p>

          <p>
            <span>Revenue</span>

            <strong>₹{calculateActualRevenue().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </p>
        </div>
      </div>

      {/* Referred Students Table */}
      <div className="parentdashboard-card" style={{ marginTop: '24px', padding: '24px', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '20px' }}>
        <h3>Referred Students ({referredStudents.length})</h3>
        {referredStudents.length > 0 ? (
          <>
            <div className="student-table-wrapper" style={{ marginTop: '1rem', overflowX: 'auto' }}>
              <table className="student-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Current Plan</th>
                    <th>Registered On</th>
                    <th>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((rs, index) => (
                    <tr 
                      key={rs.id} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/students/${rs.student?.id}`)}
                    >
                      <td>{startIndex + index + 1}</td>
                      <td><strong style={{ color: 'var(--color-primary)' }}>{rs.student?.name || 'Unknown'}</strong></td>
                      <td>{rs.student?.email || '-'}</td>
                      <td>{rs.student?.mobile || '-'}</td>
                      <td>{rs.plan?.name || (rs.currentPlanId ? 'Subscribed' : (rs.freeTrialStartDate ? 'Free Trial' : '-'))}</td>
                      <td>
                        {rs.student?.createdAt 
                          ? new Date(rs.student.createdAt).toLocaleDateString('en-IN')
                          : '-'}
                      </td>
                      <td>
                        {rs.planExpiryDate 
                          ? new Date(rs.planExpiryDate).toLocaleDateString('en-IN')
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalStudents > 0 && (
              <div className="pagination" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  Showing {startIndex + 1} to {Math.min(endIndex, totalStudents)} of {totalStudents} students
                </p>

                <div className="pagination-buttons" style={{ display: 'flex', gap: '8px' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    aria-label="Previous Page"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                  >
                    <HiOutlineChevronLeft />
                  </button>

                  {getVisiblePages().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'active-page' : ''}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        background: currentPage === page ? 'var(--color-primary)' : 'var(--color-card)',
                        color: currentPage === page ? '#ffffff' : 'var(--color-text)',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    aria-label="Next Page"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                  >
                    <HiOutlineChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '12px' }}>No students have registered using this partner's referral code yet.</p>
        )}
      </div>
    </div>
  );
};

export default PartnerDetailsPage;
