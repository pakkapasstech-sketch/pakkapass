import { HiOutlineExternalLink } from 'react-icons/hi';
import { ChartSkeleton } from '../loaders/LoadingSkeleton';

const StudentsByStateCard = ({
  data = [],
  isLoading,
}) => {
  if (isLoading) return <ChartSkeleton />;

  const max = Math.max(
    ...data.map((item) => item.count),
    1
  );

  return (
    <div className="chart-card">

      <div className="chart-header">

        <div>
          <h3 className="chart-title">
            Students by State
          </h3>

          <p className="chart-subtitle">
            Top student registrations across India
          </p>
        </div>

        <button className="chart-link">
          View Full Report
          <HiOutlineExternalLink />
        </button>

      </div>

      <div className="state-layout">

        <div className="map-placeholder">
          <span>🇮🇳 India Map</span>
        </div>

        <div className="state-list">

          {data.map((item, index) => (
            <div
              key={item.state}
              className="state-row"
            >

              <div className="state-rank">
                {index + 1}
              </div>

              <div className="state-name">
                {item.state}
              </div>

              <div className="state-progress-wrapper">

                <div className="state-progress-bar">
                  <div
                    className="state-progress-fill"
                    style={{
                      width: `${(item.count / max) * 100}%`,
                    }}
                  />
                </div>

                <span className="state-count">
                  {item.count.toLocaleString('en-IN')}
                </span>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default StudentsByStateCard;