import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineDownload } from 'react-icons/hi';

import PartnerStats from '../../components/partners/PartnerStats';
import PartnerFilters from '../../components/partners/PartnerFilters';
import PartnerTable from '../../components/partners/PartnerTable';
import partnerService from '../../services/partner.service';
import paymentService from '../../services/payment.service';

import '../../styles/partners.css';
import { useLoading } from '../../contexts/LoadingContext';
import { exportToExcel } from '../../utils/exportUtils';
import { usePartners, useUpdatePartnerStatus } from '../../hooks/usePartners';

const PartnersPage = () => {
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();
  const [search, setSearch] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [allPayments, setAllPayments] = useState([]);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const payments = await paymentService.getAll();
        setAllPayments(payments || []);
      } catch (err) {
        console.error('Failed to load all payments:', err);
      }
    };
    loadPayments();
  }, []);

  const { data: partnersData, isLoading } = usePartners({ status: statusFilter, limit: 1000 });
  const partners = partnersData?.partners || partnersData || [];
  const { mutate: updateStatus } = useUpdatePartnerStatus();

  const filteredPartners = partners
    .filter((partner) => {
      const searchTerm = search.trim().toLowerCase();

      // Calculate revenue so we can search it
      const partnerPayments = allPayments.filter(
        (p) =>
          p.partnerId === partner.id ||
          p.couponCode === partner.referralCode
      );
      const totalRevenue = partnerPayments
        .filter((p) => p.status === 'Success')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const formattedRevenue = `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const studentsCount = String(partner.analytics?.students?.totalStudents ?? 0);

      const matchesSearch =
        searchTerm === '' ||
        String(partner.id || '')
          .toLowerCase()
          .includes(searchTerm) ||
        String(partner.partnerId || '')
          .toLowerCase()
          .includes(searchTerm) ||
        (partner.name || '').toLowerCase().includes(searchTerm) ||
        (partner.contactPerson || '').toLowerCase().includes(searchTerm) ||
        (partner.contactFirstName || '').toLowerCase().includes(searchTerm) ||
        (partner.contactLastName || '').toLowerCase().includes(searchTerm) ||
        (partner.email || '').toLowerCase().includes(searchTerm) ||
        (partner.mobile || partner.phone || '').toLowerCase().includes(searchTerm) ||
        (partner.organizationName || '').toLowerCase().includes(searchTerm) ||
        (partner.institutionType || '').toLowerCase().includes(searchTerm) ||
        (partner.referralCode || '').toLowerCase().includes(searchTerm) ||
        (partner.status || '').toLowerCase().includes(searchTerm) ||
        studentsCount.includes(searchTerm) ||
        formattedRevenue.toLowerCase().includes(searchTerm);

      const matchesStatus = statusFilter === '' || partner.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => Number(a.id) - Number(b.id));

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(isLoading);
    return () => setLoading(false);
  }, [isLoading, setLoading]);

  const handleStatusChange = async (id, status) => {
    updateStatus({ id, status });
  };
  const handleExport = () => {
    const totalPartnersCount = filteredPartners.length;
    const activePartnersCount = filteredPartners.filter((p) => p.status === 'Active').length;
    const totalReferralsCount = filteredPartners.reduce(
      (sum, p) => sum + (Number(p.analytics?.students?.totalStudents) || 0),
      0
    );
    const totalRevenueGenerated = filteredPartners.reduce((sum, partner) => {
      const partnerPayments = allPayments.filter(
        (p) =>
          p.partnerId === partner.id ||
          p.couponCode === partner.referralCode
      );
      const rev = partnerPayments
        .filter((p) => p.status === 'Success')
        .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
      return sum + rev;
    }, 0);

    const summaryData = [
      { label: 'Total Partners', value: totalPartnersCount },
      { label: 'Active Partners', value: activePartnersCount },
      { label: 'Total Referrals', value: totalReferralsCount },
      { label: 'Revenue Generated', value: `₹${totalRevenueGenerated.toLocaleString('en-IN')}` },
    ];

    const columns = [
      {
        header: 'S.No',
        accessor: (_, index) => index + 1,
      },
      {
        header: 'Name',
        accessor: (row) => row.contactPerson || row.name || '—',
      },
      {
        header: 'Partner ID',
        accessor: (row) => row.partnerId || row.id || '—',
      },
      {
        header: 'Institution',
        accessor: (row) => row.institutionType || row.organizationName || '—',
      },
      {
        header: 'Email',
        accessor: (row) => row.email || '—',
      },
      {
        header: 'Mobile',
        accessor: (row) => row.mobile || row.phone || '—',
      },
      {
        header: 'REFCODE',
        accessor: (row) => row.referralCode || '—',
      },
      {
        header: 'Students',
        accessor: (row) => row.analytics?.students?.totalStudents ?? 0,
      },
      {
        header: 'Revenue',
        accessor: (row) => {
          const partnerPayments = allPayments.filter(
            (p) =>
              p.partnerId === row.id ||
              p.couponCode === row.referralCode
          );
          const totalRevenue = partnerPayments
            .filter((p) => p.status === 'Success')
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
          return `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        },
      },
      {
        header: 'Status',
        accessor: (row) => row.status || '—',
      },
      {
        header: 'Created On',
        accessor: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'),
      },
    ];

    exportToExcel(filteredPartners, columns, 'partners.xlsx', summaryData);
  };


  return (
    <div className="partners-page">
      <div className="partners-header">
        <div>
          <h1>Manage Channel Partners</h1>

          <p className="partners-description">
            Create partners, generate referral codes and monitor partner performance.
          </p>
        </div>

        <div className="header-actions">
          <button className="partners-btn-secondary" onClick={handleExport}>
            <HiOutlineDownload />
            Export
          </button>

          <button className="partners-btn-primary" onClick={() => navigate('/partners/add')}>
            <HiOutlinePlus />
            Add Partner
          </button>
        </div>
      </div>

      <PartnerStats partners={partners} allPayments={allPayments} />

      <PartnerFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

     

      <PartnerTable partners={filteredPartners} onStatusChange={handleStatusChange} allPayments={allPayments} />
    </div>
  );
};

export default PartnersPage;
