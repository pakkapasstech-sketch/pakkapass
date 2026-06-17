import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlineDownload,
} from 'react-icons/hi';

import PartnerStats from '../../components/partners/PartnerStats';
import PartnerFilters from '../../components/partners/PartnerFilters';
import PartnerTable from '../../components/partners/PartnerTable';

import '../../styles/partners.css';

const mockPartners = [
  {
    id: 1,
    partnerId: 'PP1001',
    organizationName:
      'Narayana Junior College',
    institutionType:
      'Junior College',
    contactPerson:
      'Ramesh Kumar',
    mobile: '9876543210',
    referralCode:
      'PPRA1001',
    students: 245,
    revenue: 125000,
    status: 'Active',
  },
  {
    id: 2,
    partnerId: 'PP1002',
    organizationName:
      'Sri Chaitanya',
    institutionType:
      'Coaching Center',
    contactPerson:
      'Anil Sharma',
    mobile: '9876541234',
    referralCode:
      'PPSC1002',
    students: 180,
    revenue: 95000,
    status: 'Inactive',
  },
];

const PartnersPage = () => {
  const navigate =
    useNavigate();

  const [search, setSearch] =
    useState('');

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('');

  const filteredPartners =
    mockPartners.filter(
      (partner) => {
        const matchesSearch =
          partner.organizationName
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          partner.partnerId
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesStatus =
          !statusFilter ||
          partner.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  return (
    <div className="partners-page">
      <div className="partners-header">
        <div>
          {/* <p className="partners-badge">
            Channel Partner
            Management
          </p> */}

          <h1>
            Manage Channel
            Partners
          </h1>

          <p className="partners-description">
            Create partners,
            configure
            commissions,
            generate
            referral codes and
            monitor
            performance.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="btn-secondary"
          >
            <HiOutlineDownload />
            Export
          </button>

          <button
            className="btn-primary"
            onClick={() =>
              navigate(
                '/partners/add'
              )
            }
          >
            <HiOutlinePlus />
            Add Partner
          </button>
        </div>
      </div>

      <PartnerStats
        partners={
          filteredPartners
        }
      />

      <PartnerFilters
        search={search}
        setSearch={
          setSearch
        }
        statusFilter={
          statusFilter
        }
        setStatusFilter={
          setStatusFilter
        }
      />

      <PartnerTable
        partners={
          filteredPartners
        }
      />
    </div>
  );
};

export default PartnersPage;