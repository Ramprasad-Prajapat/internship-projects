// FaceTrack AI — BranchesPage (superAdmin).
// Branch management: KPI metrics, searchable branch table, and an add/edit
// modal form backed by the mock store. Every mutation toasts + writes an audit.

import { useState, useMemo } from 'react';
import { Building2, Plus, Pencil, Trash2, Users, MapPin, FileBarChart, Settings as SettingsIcon } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  DataTable,
  Modal,
  ConfirmDialog,
  StatusBadge,
  MetricCard,
  SearchInput,
  TextField,
  SelectField,
  LocationStatusPanel,
  MockDataNotice,
  ConnectedNextActions,
} from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useStore';
import * as store from '../../services/mockStore';
import { useToast } from '../../hooks/useToast';
import { EMPLOYEE_STATUS, ROLE_BASE } from '../../utils/constants';

const EMPTY_FORM = {
  name: '',
  code: '',
  address: '',
  city: '',
  state: 'Rajasthan',
  lat: '',
  lng: '',
  radiusMeters: '150',
  status: 'active',
};

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function BranchesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const branches = useCollection('branches');
  const employees = useCollection('employees');

  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // branch being edited, or null for "add"
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toDelete, setToDelete] = useState(null); // branch pending delete confirmation

  // Employee count per branchId, computed once per data change.
  const countByBranch = useMemo(() => {
    const map = {};
    for (const e of employees) {
      map[e.branchId] = (map[e.branchId] || 0) + 1;
    }
    return map;
  }, [employees]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return branches;
    return branches.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.code || '').toLowerCase().includes(q) ||
        (b.city || '').toLowerCase().includes(q) ||
        (b.state || '').toLowerCase().includes(q)
    );
  }, [branches, query]);

  const totalBranches = branches.length;
  const totalEmployees = employees.length;
  const avgRadius = useMemo(() => {
    if (!branches.length) return 0;
    const sum = branches.reduce((acc, b) => acc + (Number(b.radiusMeters) || 0), 0);
    return Math.round(sum / branches.length);
  }, [branches]);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (branch) => {
    setEditing(branch);
    setForm({
      name: branch.name || '',
      code: branch.code || '',
      address: branch.address || '',
      city: branch.city || '',
      state: branch.state || '',
      lat: branch.lat == null ? '' : String(branch.lat),
      lng: branch.lng == null ? '' : String(branch.lng),
      radiusMeters: branch.radiusMeters == null ? '' : String(branch.radiusMeters),
      status: branch.status || 'active',
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.code.trim()) next.code = 'Code is required.';
    if (!form.city.trim()) next.city = 'City is required.';
    if (form.lat === '' || Number.isNaN(Number(form.lat))) next.lat = 'Enter a numeric latitude.';
    if (form.lng === '' || Number.isNaN(Number(form.lng))) next.lng = 'Enter a numeric longitude.';
    if (form.radiusMeters !== '' && Number.isNaN(Number(form.radiusMeters)))
      next.radiusMeters = 'Enter a numeric radius.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      lat: Number(form.lat),
      lng: Number(form.lng),
      radiusMeters: Number(form.radiusMeters) || 0,
      status: form.status,
    };

    if (editing) {
      store.update('branches', editing.id, payload);
      store.addAudit({
        actor: user?.name,
        role: user?.role,
        action: 'branchUpdated',
        target: editing.id,
        description: `Updated branch "${payload.name}" (${payload.code}).`,
      });
      toast.success(`Branch "${payload.name}" updated.`);
    } else {
      const record = {
        id: store.genId('br'),
        branchAdminId: null,
        ...payload,
      };
      store.insert('branches', record);
      store.addAudit({
        actor: user?.name,
        role: user?.role,
        action: 'branchCreated',
        target: record.id,
        description: `Created branch "${payload.name}" (${payload.code}).`,
      });
      toast.success(`Branch "${payload.name}" added.`);
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!toDelete) return;
    const branch = toDelete;
    store.remove('branches', branch.id);
    store.addAudit({
      actor: user?.name,
      role: user?.role,
      action: 'branchDeleted',
      target: branch.id,
      description: `Deleted branch "${branch.name}" (${branch.code}).`,
    });
    toast.success(`Branch "${branch.name}" deleted.`);
    setToDelete(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Branch',
      render: (b) => (
        <div className="ft-id-cell">
          <span className="ft-id-name">{b.name}</span>
          <span className="ft-id-sub">{b.code}</span>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'City / State',
      sortValue: (b) => b.city || '',
      render: (b) => (
        <span>
          {b.city || '—'}
          {b.state ? <span className="ft-cell-dim">, {b.state}</span> : null}
        </span>
      ),
    },
    {
      key: 'radiusMeters',
      label: 'Radius',
      align: 'right',
      sortValue: (b) => Number(b.radiusMeters) || 0,
      render: (b) => <span className="ft-cell-strong">{Number(b.radiusMeters) || 0} m</span>,
    },
    {
      key: 'employees',
      label: 'Employees',
      align: 'right',
      sortValue: (b) => countByBranch[b.id] || 0,
      render: (b) => <span className="ft-cell-strong">{countByBranch[b.id] || 0}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      sortValue: (b) => b.status,
      render: (b) => <StatusBadge map={EMPLOYEE_STATUS} value={b.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (b) => (
        <div className="ft-cell-actions">
          <button
            className="ft-icon-btn"
            type="button"
            title="Edit branch"
            aria-label={`Edit ${b.name}`}
            onClick={() => openEdit(b)}
          >
            <Pencil size={16} />
          </button>
          <button
            className="ft-icon-btn"
            type="button"
            title="Delete branch"
            aria-label={`Delete ${b.name}`}
            onClick={() => setToDelete(b)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="ft-page">
      <PageHeader
        title="Branches"
        subtitle="Create and manage office locations, geofence radius and status."
        actions={
          <button className="ft-btn ft-btn--primary" type="button" onClick={openAdd}>
            <Plus size={16} />
            Add Branch
          </button>
        }
      />

      <div className="ft-kpi-grid">
        <MetricCard icon={Building2} label="Total Branches" value={totalBranches} tone="primary" />
        <MetricCard icon={Users} label="Total Employees" value={totalEmployees} tone="accent" />
        <MetricCard icon={Building2} label="Avg. Geofence Radius" value={`${avgRadius} m`} tone="info" />
      </div>

      <SectionCard title="All Branches" subtitle={`${branches.length} location(s)`} icon={Building2}>
        <div className="ft-toolbar">
          <div className="ft-toolbar-grow">
            <SearchInput value={query} onChange={setQuery} placeholder="Search by name, code or city..." />
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          pageSize={10}
          initialSort={{ key: 'name', dir: 'asc' }}
          emptyMessage="No branches match your search."
          emptyIcon={Building2}
        />
      </SectionCard>

      <SectionCard
        title="Rajasthan Branch Network"
        subtitle={`${branches.length} offices · 150 m standard geofence`}
        icon={MapPin}
      >
        <div className="ft-map-placeholder">
          <MapPin size={30} className="ft-map-pin" />
          <div className="ft-block-title">Rajasthan office map</div>
          <p className="ft-map-caption">
            Interactive map integration is planned for a future version. The offices below use demo
            coordinates for mock radius verification.
          </p>
          <div className="ft-map-chips">
            {branches.map((b) => (
              <span key={b.id} className="ft-pill">
                <MapPin size={12} /> {b.city}
              </span>
            ))}
          </div>
        </div>

        <div className="ft-grid-2" style={{ marginTop: 16 }}>
          {branches.map((b) => (
            <LocationStatusPanel key={b.id} branch={b} />
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <MockDataNotice>
            Demo office locations across Rajasthan are used for mock radius verification. Replace with
            exact office GPS coordinates during a real deployment.
          </MockDataNotice>
        </div>
      </SectionCard>

      <ConnectedNextActions
        actions={[
          { icon: SettingsIcon, label: 'Attendance settings', hint: 'Geofence & grace rules', to: `${ROLE_BASE[user?.role]}/settings`, tone: 'primary' },
          { icon: FileBarChart, label: 'Reports', hint: 'Branch-wise insights', to: `${ROLE_BASE[user?.role]}/reports`, tone: 'accent' },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editing ? `Edit Branch — ${editing.name}` : 'Add Branch'}
        size="lg"
        onClose={closeModal}
        footer={
          <>
            <button className="ft-btn ft-btn--ghost" type="button" onClick={closeModal}>
              Cancel
            </button>
            <button className="ft-btn ft-btn--primary" type="button" onClick={handleSave}>
              {editing ? 'Save Changes' : 'Create Branch'}
            </button>
          </>
        }
      >
        <div className="ft-grid-2">
          <TextField
            label="Branch Name"
            value={form.name}
            onChange={setField('name')}
            required
            placeholder="Jaipur HQ"
            error={errors.name}
          />
          <TextField
            label="Code"
            value={form.code}
            onChange={setField('code')}
            required
            placeholder="JAI"
            error={errors.code}
          />
        </div>

        <TextField
          label="Address"
          value={form.address}
          onChange={setField('address')}
          placeholder="C-Scheme, Jaipur, Rajasthan"
        />

        <div className="ft-grid-2">
          <TextField
            label="City"
            value={form.city}
            onChange={setField('city')}
            required
            placeholder="Jaipur"
            error={errors.city}
          />
          <TextField label="State" value={form.state} onChange={setField('state')} placeholder="Rajasthan" />
        </div>

        <div className="ft-grid-3">
          <TextField
            label="Latitude"
            type="number"
            value={form.lat}
            onChange={setField('lat')}
            required
            placeholder="26.9124"
            error={errors.lat}
          />
          <TextField
            label="Longitude"
            type="number"
            value={form.lng}
            onChange={setField('lng')}
            required
            placeholder="75.7873"
            error={errors.lng}
          />
          <TextField
            label="Allowed Radius (m)"
            type="number"
            value={form.radiusMeters}
            onChange={setField('radiusMeters')}
            placeholder="150"
            error={errors.radiusMeters}
          />
        </div>

        <SelectField
          label="Status"
          value={form.status}
          onChange={setField('status')}
          options={STATUS_OPTIONS}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete branch?"
        message={
          toDelete
            ? `Delete "${toDelete.name}" (${toDelete.code})? This cannot be undone. Employees assigned to this branch will keep their branchId.`
            : ''
        }
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
}
