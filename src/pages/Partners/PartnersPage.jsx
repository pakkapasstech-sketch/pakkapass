import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineDownload } from 'react-icons/hi';

import PartnerStats from '../../components/partners/PartnerStats';
import PartnerFilters from '../../components/partners/PartnerFilters';
import PartnerTable from '../../components/partners/PartnerTable';
import partnerService from '../../services/partner.service';

import '../../styles/partners.css';
import { useLoading } from '../../contexts/LoadingContext';
import { exportToExcel } from '../../utils/exportUtils';
const PartnersPage = () => {
  const navigate = useNavigate();
  const { setLoading :setGlobalLoading} = useLoading();
  const [search, setSearch] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState('');

  const [partners, setPartners] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
  setGlobalLoading(loading);

  return () => setGlobalLoading(false);
}, [loading, setGlobalLoading]);
  const filteredPartners = partners.filter((partner) => {
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      searchTerm === '' ||
      String(partner.id || '')
        .toLowerCase()
        .includes(searchTerm) ||
      (partner.name || '').toLowerCase().includes(searchTerm) ||
      (partner.email || '').toLowerCase().includes(searchTerm) ||
      (partner.mobile || partner.phone || '').toLowerCase().includes(searchTerm) ||
      (partner.organizationName || '').toLowerCase().includes(searchTerm) ||
      (partner.referralCode || '').toLowerCase().includes(searchTerm) ||
      (partner.status || '').toLowerCase().includes(searchTerm);

    const matchesStatus = statusFilter === '' || partner.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchPartners = async () => {
    try {
      // show loading only on first load
      if (!partners.length) {
        setLoading(true);
      }

      const res = await partnerService.getAll({
        status: statusFilter,
      });

      console.log('PARTNERS', res);

      setPartners(res.partners || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (id, status) => {
    try {
      await partnerService.updateStatus(id, status);

      setPartners((prev) =>
        prev.map((partner) =>
          partner.id === id
            ? {
                ...partner,
                status,
              }
            : partner
        )
      );
    } catch (err) {
      console.error(err);
    }
  };
  const handleExport = () => {
    const columns = [
      {
        header: 'Partner ID',
        accessor: (row) => row.id,
      },
      {
        header: 'Name',
        accessor: (row) => row.name,
      },
      {
        header: 'Email',
        accessor: (row) => row.email,
      },
      {
        header: 'Mobile',
        accessor: (row) => row.mobile || row.phone,
      },
      {
        header: 'Organization',
        accessor: (row) => row.organizationName,
      },
      {
        header: 'Referral Code',
        accessor: (row) => row.referralCode,
      },
      {
        header: 'Status',
        accessor: (row) => row.status,
      },
      {
        header: 'Created On',
        accessor: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ''),
      },
    ];

    exportToExcel(filteredPartners, columns, 'partners.xlsx');
  };
  useEffect(() => {
    fetchPartners();
  }, [debouncedSearch, statusFilter]);



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

      <PartnerStats partners={partners} />

      <PartnerFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {loading && <div className="table-loading">Updating...</div>}

      <PartnerTable partners={filteredPartners} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default PartnersPage;
