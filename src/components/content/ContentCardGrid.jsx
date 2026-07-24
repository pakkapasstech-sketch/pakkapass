import {
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineSparkles,
  HiOutlineLibrary,
  HiOutlineCollection,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineArrowLeft,
} from 'react-icons/hi';

const ContentCardGrid = ({
  title,
  subtitle,
  items = [],
  onSelect,
  onBack,
  onAdd,
  onEdit,
  onDelete,
  type = 'board', // 'board' | 'branch' | 'subject'
}) => {
  const getIcon = (index) => {
    const icons = [
      HiOutlineAcademicCap,
      HiOutlineLibrary,
      HiOutlineBookOpen,
      HiOutlineSparkles,
      HiOutlineCollection,
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="content-card-grid-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid var(--color-border, #e5e7eb)',
                background: 'var(--color-card, #ffffff)',
                color: 'var(--color-text-primary, #111827)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <HiOutlineArrowLeft />
              Back
            </button>
          )}

          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--color-text-primary, #111827)' }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary, #6b7280)', margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--color-primary, #6653AF)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(102, 83, 175, 0.25)',
            }}
          >
            <HiOutlinePlus size={18} />
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {items.map((item, idx) => {
            const Icon = getIcon(idx);
            const itemName = item.displayName || item.name || item.title || item;

            return (
              <div
                key={item.id || itemName}
                onClick={() => onSelect(item)}
                style={{
                  background: 'var(--color-card, #ffffff)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid var(--color-border, #e5e7eb)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '170px',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(102, 83, 175, 0.15)';
                  e.currentTarget.style.borderColor = 'var(--color-primary, #6653AF)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = 'var(--color-border, #e5e7eb)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '14px',
                        background: 'rgba(102, 83, 175, 0.1)',
                        color: 'var(--color-primary, #6653AF)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={26} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {onEdit && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                          style={{
                            padding: '6px',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border, #e5e7eb)',
                            background: 'var(--color-card, #ffffff)',
                            color: 'var(--color-primary, #6653AF)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title={`Edit ${type} name`}
                        >
                          <HiOutlinePencil size={15} />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item);
                          }}
                          style={{
                            padding: '6px',
                            borderRadius: '8px',
                            border: '1px solid #fecaca',
                            background: '#fef2f2',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title={`Delete ${type}`}
                        >
                          <HiOutlineTrash size={15} />
                        </button>
                      )}

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: 'rgba(102, 83, 175, 0.1)',
                          color: 'var(--color-primary, #6653AF)',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {type}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--color-text-primary, #111827)' }}>
                    {itemName}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: 0 }}>
                    Click to view {type === 'board' ? 'Branches' : type === 'branch' ? 'Subjects' : 'Chapters & Content'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--color-border, #f1f5f9)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary, #6653AF)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Select {type} &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--color-card, #ffffff)', borderRadius: '20px', border: '1px dashed var(--color-border, #d1d5db)' }}>
          <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary, #111827)', margin: '0 0 12px 0' }}>
            No {type}s available
          </p>
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: 'none',
                background: 'var(--color-primary, #6653AF)',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <HiOutlinePlus size={18} />
              Add First {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentCardGrid;
