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
import medicalImg from '../../assets/course_medical.jpg';
import managementImg from '../../assets/course_management.jpg';

const ContentCardGrid = ({
  title,
  subtitle,
  items = [],
  onSelect,
  onBack,
  onAdd,
  onEdit,
  onDelete,
  hasBranches = true,
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
                border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
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
            const itemName = item.displayName || item.name || item.title || item;
            const bannerImage = idx % 2 === 0 ? medicalImg : managementImg;
            
            return (
              <div
                key={item.id || itemName}
                style={{
                  background: 'var(--color-card, #ffffff)',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border, var(--color-border, #e5e7eb))',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ position: 'relative', height: '160px', width: '100%', background: 'var(--color-border-light, #f3f4f6)' }}>
                  <img src={bannerImage} alt="Course Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '0', right: '0', background: '#f59e0b', color: '#fff', padding: '6px 12px', fontSize: '13px', fontWeight: 'bold' }}>
                    {type.toUpperCase()}
                  </div>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 
                    style={{ 
                      fontSize: '18px', 
                      fontWeight: '700', 
                      margin: '0 0 12px 0', 
                      color: 'var(--color-primary, #6653AF)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={itemName}
                  >
                    {itemName}
                  </h3>
                  
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '0 0 6px 0' }}>
                    Course ID : {type.toUpperCase().substring(0,3)}ID{item.id || Math.floor(Math.random() * 1000) + 1000}
                  </p>
                  
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #6b7280)', margin: '0 0 20px 0' }}>
                    Created On : {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '03/18/2026'}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {onEdit && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}
                        style={{
                          background: 'transparent',
                          color: 'var(--color-primary, #6653AF)',
                          border: 'none',
                          padding: '6px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title={`Edit ${type}`}
                      >
                        <HiOutlinePencil size={16} />
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
                          background: 'transparent',
                          color: '#ef4444',
                          border: 'none',
                          padding: '6px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title={`Delete ${type}`}
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      style={{
                        background: 'var(--color-primary, #6653AF)',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginLeft: 'auto'
                      }}
                    >
                      {type === 'board' ? (hasBranches ? 'View branches' : 'View subjects') : type === 'branch' ? 'View subjects' : 'View content'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--color-card, #ffffff)', borderRadius: '20px', border: '1px dashed var(--color-border, var(--color-border, #e5e7eb))' }}>
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
