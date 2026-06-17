import { useState } from 'react';
import { HiOutlinePlus, HiOutlineSearch, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import StatisticCard from '../../components/cards/StatisticCard';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/tables/StatusBadge';
import Pagination from '../../components/tables/Pagination';
import Modal from '../../components/modals/Modal';
import LoadingSkeleton from '../../components/loaders/LoadingSkeleton';
import ErrorState from '../../components/loaders/ErrorState';
import EmptyState from '../../components/loaders/EmptyState';
import { usePartners, useCreatePartner, useUpdatePartner, useUpdatePartnerStatus } from '../../hooks/usePartners';
import { usePermissions } from '../../auth/usePermissions';
import { PERMISSIONS } from '../../auth/permissions';
import { INSTITUTION_TYPES, PARTNER_STATUSES, COMMISSION_TYPES, SETTLEMENT_CYCLES } from '../../mock/partners';
import '../../styles/partners.css';

const emptyForm = {
  contactFirstName: '', contactLastName: '', organizationName: '', institutionType: 'Coaching Center',
  mobile: '', email: '', addressLine1: '', city: '', district: '', state: '', country: 'India', pincode: '',
  commissionType: 'Percentage Based', commissionValue: 10, settlementCycle: 'Monthly',
  discountType: 'Percentage Based', discountValue: 10, couponActive: true, status: 'Active',
};

const PartnerForm = ({ form, onChange }) => (
  <div className="partner-form-grid">
    <fieldset><legend>Personal Information</legend>
      <input placeholder="First Name *" value={form.contactFirstName} onChange={(e) => onChange('contactFirstName', e.target.value)} />
      <input placeholder="Last Name *" value={form.contactLastName} onChange={(e) => onChange('contactLastName', e.target.value)} />
    </fieldset>
    <fieldset><legend>Organization</legend>
      <input placeholder="Organization Name *" value={form.organizationName} onChange={(e) => onChange('organizationName', e.target.value)} />
      <select value={form.institutionType} onChange={(e) => onChange('institutionType', e.target.value)}>
        {INSTITUTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
    </fieldset>
    <fieldset><legend>Contact</legend>
      <input placeholder="Mobile *" value={form.mobile} onChange={(e) => onChange('mobile', e.target.value)} />
      <input placeholder="Email *" type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} />
    </fieldset>
    <fieldset><legend>Address</legend>
      <input placeholder="Address Line 1 *" value={form.addressLine1} onChange={(e) => onChange('addressLine1', e.target.value)} />
      <input placeholder="City *" value={form.city} onChange={(e) => onChange('city', e.target.value)} />
      <input placeholder="District *" value={form.district} onChange={(e) => onChange('district', e.target.value)} />
      <input placeholder="State *" value={form.state} onChange={(e) => onChange('state', e.target.value)} />
      <input placeholder="Pincode *" value={form.pincode} onChange={(e) => onChange('pincode', e.target.value)} />
    </fieldset>
    <fieldset><legend>Commission & Discount</legend>
      <select value={form.commissionType} onChange={(e) => onChange('commissionType', e.target.value)}>
        {COMMISSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <input type="number" placeholder="Commission Value" value={form.commissionValue} onChange={(e) => onChange('commissionValue', +e.target.value)} />
      <select value={form.settlementCycle} onChange={(e) => onChange('settlementCycle', e.target.value)}>
        {SETTLEMENT_CYCLES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <select value={form.discountType} onChange={(e) => onChange('discountType', e.target.value)}>
        {COMMISSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <input type="number" placeholder="Discount Value" value={form.discountValue} onChange={(e) => onChange('discountValue', +e.target.value)} />
    </fieldset>
  </div>
);

const PartnersPage = () => {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.INSTITUTION_EDIT);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const { data, isLoading, isError, refetch } = usePartners({ search, status: statusFilter, page, limit: 10 });
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const updateStatus = useUpdatePartnerStatus();

  const partners = data?.partners || [];
  const total = data?.total || 0;

  const handleFormChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openCreate = () => { setForm(emptyForm); setEditId(null); setFormOpen(true); };
  const openEdit = (p) => {
    setForm({ ...emptyForm, ...p, contactFirstName: p.contactFirstName, contactLastName: p.contactLastName });
    setEditId(p.id);
    setFormOpen(true);
  };
  const openDetail = (p) => { setSelected(p); setDetailOpen(true); };

  const handleSubmit = async () => {
    if (editId) await updatePartner.mutateAsync({ id: editId, ...form });
    else await createPartner.mutateAsync(form);
    setFormOpen(false);
  };

  const columns = [
    { key: 'partnerId', header: 'Partner ID', accessor: (r) => r.partnerId },
    { key: 'org', header: 'Organization', accessor: (r) => r.organizationName },
    { key: 'contact', header: 'Contact', accessor: (r) => r.contactPerson },
    { key: 'mobile', header: 'Mobile', accessor: (r) => r.mobile },
    { key: 'referral', header: 'Referral Code', accessor: (r) => r.referralCode },
    { key: 'students', header: 'Students', accessor: (r) => r.analytics?.students?.totalStudents ?? 0 },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  if (isError) return <ErrorState message="Failed to load partners" onRetry={refetch} />;

  const kpiCards = [
    { id: 'total', title: 'Total Partners', formattedValue: String(total), trend: 0, trendLabel: '', trendUp: true, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', icon: 'partners' },
    { id: 'active', title: 'Active Partners', formattedValue: String(partners.filter((p) => p.status === 'Active').length), trend: 0, trendLabel: '', trendUp: true, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: 'partners' },
    { id: 'students', title: 'Total Referrals', formattedValue: String(partners.reduce((s, p) => s + (p.analytics?.students?.totalStudents || 0), 0)), trend: 0, trendLabel: '', trendUp: true, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', icon: 'students' },
  ];

  return (
    <div className="partners-page">
      <div className="partners-toolbar">
        <div className="partners-search">
          <HiOutlineSearch />
          <input placeholder="Search partners..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {PARTNER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="button" className="btn-secondary" onClick={() => toast.success('Export started')}>
          <HiOutlineDownload /> Export
        </button>
        {canEdit && (
          <button type="button" className="btn-primary" onClick={openCreate}>
            <HiOutlinePlus /> Add Partner
          </button>
        )}
      </div>

      <div className="dashboard-stats-grid">
        {kpiCards.map((c) => <StatisticCard key={c.id} {...c} isLoading={isLoading} />)}
      </div>

      {isLoading ? <LoadingSkeleton rows={6} /> : partners.length === 0 ? (
        <EmptyState title="No partners found" description="Create your first channel partner to get started." action={canEdit ? <button type="button" className="btn-primary" onClick={openCreate}>Create Partner</button> : undefined} />
      ) : (
        <>
          <DataTable
            title="Channel Partners"
            columns={columns}
            data={partners}
            actions={canEdit}
            onView={openDetail}
            onEdit={canEdit ? openEdit : undefined}
            onDelete={canEdit ? (r) => updateStatus.mutate({ id: r.id, status: 'Suspended' }) : undefined}
          />
          <Pagination currentPage={page} totalItems={total} pageSize={10} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editId ? 'Edit Partner' : 'Create Partner'}>
        <PartnerForm form={form} onChange={handleFormChange} />
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleSubmit} disabled={createPartner.isPending || updatePartner.isPending}>
            {editId ? 'Update Partner' : 'Create Partner'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Partner Details">
        {selected && (
          <div className="partner-detail">
            <section><h4>Organization</h4><p>{selected.organizationName} ({selected.institutionType})</p></section>
            <section><h4>Contact</h4><p>{selected.contactPerson} · {selected.mobile} · {selected.email}</p></section>
            <section><h4>Referral</h4><p><strong>{selected.referralCode}</strong></p><p>{selected.referralMessage}</p></section>
            <section><h4>Commission</h4><p>{selected.commissionType}: {selected.commissionValue} · {selected.settlementCycle}</p></section>
            <section><h4>Discount</h4><p>{selected.discountType}: {selected.discountValue} · {selected.couponActive ? 'Active' : 'Inactive'}</p></section>
            <section><h4>Analytics</h4>
              <p>Students: {selected.analytics?.students?.totalStudents ?? 0} · Revenue: ₹{(selected.analytics?.revenue?.totalRevenue ?? 0).toLocaleString()}</p>
            </section>
            {canEdit && (
              <div className="status-actions">
                {PARTNER_STATUSES.map((s) => (
                  <button key={s} type="button" className={`btn-status ${selected.status === s ? 'active' : ''}`}
                    onClick={() => { updateStatus.mutate({ id: selected.id, status: s }); setSelected({ ...selected, status: s }); }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PartnersPage;
