import {
  useEffect,
  useState,
} from 'react';
import {
  useNavigate,
} from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlineDownload,
} from 'react-icons/hi';

import PartnerStats from '../../components/partners/PartnerStats';
import PartnerFilters from '../../components/partners/PartnerFilters';
import PartnerTable from '../../components/partners/PartnerTable';
import partnerService from '../../services/partner.service';

import '../../styles/partners.css';

const PartnersPage = () => {
  const navigate =
    useNavigate();

  const [search, setSearch] =
    useState('');

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState('');

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('');

  const [partners, setPartners] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setDebouncedSearch(
          search
        );
      }, 500);

    return () =>
      clearTimeout(
        timer
      );
  }, [search]);

  const fetchPartners =
    async () => {
      try {
        // show loading only on first load
        if (
          !partners.length
        ) {
          setLoading(
            true
          );
        }

        const res =
          await partnerService.getAll(
            {
              search:
                debouncedSearch,
              status:
                statusFilter,
            }
          );

        console.log(
          'PARTNERS',
          res
        );

        setPartners(
          res.partners ||
            []
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchPartners();
  }, [
    debouncedSearch,
    statusFilter,
  ]);

  if (
    loading &&
    !partners.length
  ) {
    return (
      <div className="partners-page">
        <div className="loading-skeleton">
          Loading partners...
        </div>
      </div>
    );
  }

  return (
    <div className="partners-page">
      <div className="partners-header">
        <div>
          <h1>
            Manage Channel
            Partners
          </h1>

          <p className="partners-description">
            Create
            partners,
            generate
            referral
            codes and
            monitor
            partner
            performance.
          </p>
        </div>

        <div className="header-actions">
          <button className="partners-btn-secondary">
            <HiOutlineDownload />
            Export
          </button>

          <button
            className="partners-btn-primary"
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
          partners
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

      {loading && (
        <div className="table-loading">
          Updating...
        </div>
      )}

      <PartnerTable
        partners={
          partners
        }
      />
    </div>
  );
};

export default PartnersPage;