import { HiOutlineExternalLink } from "react-icons/hi";
import { ChartSkeleton } from "../loaders/LoadingSkeleton";
import "../../styles/StudentsByStateCard.css"
const StudentsByStateCard = ({
  data = [],
  isLoading,
}) => {
  if (isLoading) return <ChartSkeleton />;

  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="students-card">
  <div className="students-header">
    <div>
      <h3 className="students-title">Students by State</h3>
      <p className="students-subtitle">
        Top registrations across India
      </p>
    </div>

    <button className="report-btn">
      View Report
      <HiOutlineExternalLink />
    </button>
  </div>

  <div className="students-body">
    <div className="india-map">
      🇮🇳
    </div>

    <div className="state-list">
      {data.map((item, index) => (
        <div key={item.state} className="state-item">
          <span className="state-rank">
            {index + 1}
          </span>

          <div className="state-info">
            <div className="state-top">
              <span>{item.state}</span>
              <span>
                {item.count.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${(item.count / max) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );
};

export default StudentsByStateCard;