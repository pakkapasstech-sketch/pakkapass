import { useState, useEffect, useMemo } from 'react';
import {
  HiOutlineTrendingUp,
  HiOutlineEye,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineSearch,
  HiStar,
  HiOutlineTag,
  HiOutlineCollection
} from 'react-icons/hi';
import mostViewedService from '../../services/mostViewedService';
import GlobalLoader from '../../components/loaders/GlobalLoader';
import ErrorState from '../../components/loaders/ErrorState';
import Pagination from '../../components/tables/Pagination';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
import '../../styles/mostViewed.css';

const ITEMS_PER_PAGE = 10;

const MostViewedPage = () => {
  const [data, setData] = useState({ mostViewedTopics: [], subjectHours: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await mostViewedService.getMostViewed();
      setData({
        mostViewedTopics: res.mostViewedTopics || [],
        subjectHours: res.subjectHours || []
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch most-viewed content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const topics = data.mostViewedTopics;
  const hours = data.subjectHours;

  // Combine subjects from backend hours + topics list so ALL subjects appear (even if 0 hrs)
  const combinedSubjectHours = useMemo(() => {
    const map = {};

    // 1. Add logged watch hours from backend
    hours.forEach((sh) => {
      if (sh.subjectName) {
        map[sh.subjectName] = parseFloat(sh.totalWatchHours) || 0;
      }
    });

    // 2. Add any remaining subjects from topics list with 0 hrs
    topics.forEach((t) => {
      if (t.subjectName && map[t.subjectName] === undefined) {
        map[t.subjectName] = 0;
      }
    });

    return Object.entries(map).map(([subjectName, totalWatchHours]) => ({
      subjectName,
      totalWatchHours
    }));
  }, [hours, topics]);

  // Extract unique subject names for filter dropdown
  const subjectsList = useMemo(() => {
    const list = ['All Subjects'];
    topics.forEach((t) => {
      if (t.subjectName && !list.includes(t.subjectName)) {
        list.push(t.subjectName);
      }
    });
    return list;
  }, [topics]);

  // Filter topics based on search query across ALL columns, selected subject, and selected rating
  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return topics.filter((item, index) => {
      const globalRank = index + 1;
      const views = item.uniqueStudents || item.viewCount || 0;
      const watchHrs = parseFloat(item.watchHours || 0).toFixed(1);
      const ratingNum = parseFloat(item.averageRating) || 0;
      const ratingText = ratingNum > 0 ? ratingNum.toFixed(1) : '0';
      const tagText = globalRank <= 3 ? 'most viewed' : 'standard';

      const searchableFields = [
        `#${globalRank}`,
        String(globalRank),
        item.topicName,
        item.name,
        item.title,
        item.grade,
        item.board,
        item.branch,
        item.subjectName,
        item.subject,
        String(views),
        `${views} views`,
        `${watchHrs} hrs`,
        String(watchHrs),
        ratingText,
        tagText
      ];

      const matchesSearch =
        !query ||
        searchableFields.some(
          (field) => field && String(field).toLowerCase().includes(query)
        );

      const matchesSubject =
        !selectedSubject ||
        selectedSubject === 'All' ||
        selectedSubject === 'All Subjects' ||
        item.subjectName === selectedSubject ||
        item.subject === selectedSubject;
      
      let matchesRating = true;
      if (selectedRating === '5 Stars (4.5+)' || selectedRating === '5') {
        matchesRating = ratingNum >= 4.5;
      } else if (selectedRating === '4 Stars & above' || selectedRating === '4+') {
        matchesRating = ratingNum >= 4.0;
      } else if (selectedRating === '3 Stars & above' || selectedRating === '3+') {
        matchesRating = ratingNum >= 3.0;
      } else if (selectedRating === '2 Stars & above' || selectedRating === '2+') {
        matchesRating = ratingNum >= 2.0;
      } else if (selectedRating === 'Unrated / No Rating' || selectedRating === 'unrated') {
        matchesRating = ratingNum === 0;
      }

      return matchesSearch && matchesSubject && matchesRating;
    });
  }, [topics, searchQuery, selectedSubject, selectedRating]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSubject, selectedRating]);

  const totalViewers = useMemo(() => {
    return topics.reduce((acc, curr) => acc + (parseInt(curr.uniqueStudents || curr.viewCount || 0, 10) || 0), 0);
  }, [topics]);

  const avgOverallRating = useMemo(() => {
    const validRatings = topics
      .map((t) => parseFloat(t.averageRating) || 0)
      .filter((r) => r > 0);
    if (validRatings.length === 0) return 0;
    const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
    return (sum / validRatings.length).toFixed(1);
  }, [topics]);

  const totalWatchHours = useMemo(() => {
    const sum = combinedSubjectHours.reduce(
      (acc, curr) => acc + (parseFloat(curr.totalWatchHours) || 0),
      0
    );
    return sum.toFixed(1);
  }, [combinedSubjectHours]);

  const totalPages = Math.ceil(filteredTopics.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTopics = filteredTopics.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="most-viewed-container">
        <GlobalLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="most-viewed-container">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="most-viewed-container">
      <div className="most-viewed-header">
        <div>
          <h1>Most Viewed Content & Video Ratings</h1>
          <div className="most-viewed-subtitle">
            Overview of top performing content, student engagement views, and rating feedback
          </div>
        </div>
      </div>

      <div className="most-viewed-stats-grid">
        <div className="most-viewed-stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <HiOutlineEye />
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalViewers}</span>
            <span className="stat-label">Total Views</span>
          </div>
        </div>

        <div className="most-viewed-stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">
            <HiOutlineStar />
          </div>
          <div className="stat-content">
            <span className="stat-value">{avgOverallRating > 0 ? `${avgOverallRating} / 5.0` : '0'}</span>
            <span className="stat-label">Average Video Rating</span>
          </div>
        </div>

        <div className="most-viewed-stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">
            <HiOutlineClock />
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalWatchHours} hrs</span>
            <span className="stat-label">Total Watch Hours</span>
          </div>
        </div>

        <div className="most-viewed-stat-card">
          <div className="stat-icon-wrapper stat-icon-emerald">
            <HiOutlineTrendingUp />
          </div>
          <div className="stat-content">
            <span className="stat-value">{topics.length}</span>
            <span className="stat-label">Active Topics</span>
          </div>
        </div>
      </div>

      <div className="most-viewed-card">
        <div className="most-viewed-card-header">
          <div className="most-viewed-card-title">
            <HiOutlineTrendingUp style={{ color: '#2563eb', fontSize: 22 }} />
            Most Viewed Content & Videos
          </div>

          <div className="most-viewed-controls">
            <CommonFilterDropdown
              placeholder="All Subjects"
              value={selectedSubject}
              options={subjectsList}
              onChange={setSelectedSubject}
            />

            <CommonFilterDropdown
              placeholder="All Ratings"
              value={selectedRating}
              options={[
                'All Ratings',
                '5 Stars (4.5+)',
                '4 Stars & above',
                '3 Stars & above',
                '2 Stars & above',
                'Unrated / No Rating'
              ]}
              onChange={setSelectedRating}
            />

            <div className="search-input-wrapper">
              <HiOutlineSearch style={{ position: 'absolute', left: 12, color: '#94a3b8', fontSize: 16 }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="clean-data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank</th>
                <th>Topic / Video Title</th>
                <th>Grade</th>
                <th>Board</th>
                <th>Branch</th>
                <th>Subject</th>
                <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Views</th>
                <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Watch Hrs</th>
                <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Avg Rating</th>
                <th style={{ width: '130px' }}>Tag</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTopics.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b' }}>
                    <HiOutlineCollection style={{ fontSize: 36, color: '#cbd5e1', marginBottom: 8 }} />
                    <div>No content matches your search filter</div>
                  </td>
                </tr>
              ) : (
                paginatedTopics.map((item, index) => {
                  const globalRank = startIndex + index + 1;
                  const rating = parseFloat(item.averageRating) || 0;
                  const isTopThree = globalRank <= 3;

                  return (
                    <tr key={index}>
                      <td>
                        <div className={`rank-pill ${globalRank === 1 ? 'rank-1' : globalRank === 2 ? 'rank-2' : globalRank === 3 ? 'rank-3' : 'rank-normal'}`}>
                          #{globalRank}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{item.topicName}</td>
                      <td style={{ color: '#475569' }}>{item.grade || 'N/A'}</td>
                      <td style={{ color: '#475569' }}>{item.board || 'N/A'}</td>
                      <td style={{ color: '#475569' }}>{item.branch || 'N/A'}</td>
                      <td style={{ color: '#475569' }}>{item.subjectName}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span className="view-count-badge">
                          <HiOutlineEye style={{ fontSize: 15 }} />
                          {item.uniqueStudents || item.viewCount || 0} views
                        </span>
                      </td>
                      <td style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                        {parseFloat(item.watchHours || 0).toFixed(1)} hrs
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <HiStar
                              key={star}
                              style={{
                                color: star <= Math.round(rating) ? '#f59e0b' : '#e2e8f0'
                              }}
                            />
                          ))}
                          <span className="rating-score">
                            {rating > 0 ? rating.toFixed(1) : 0}
                          </span>
                        </div>
                      </td>
                      <td>
                        {isTopThree ? (
                          <span className="badge-tag-most-viewed">
                            <HiOutlineTag style={{ fontSize: 12 }} />
                            Most Viewed
                          </span>
                        ) : (
                          <span className="badge-tag-normal">
                            Standard
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="table-footer">
          <div className="table-showing-entries">
            Showing {filteredTopics.length > 0 ? startIndex + 1 : 0} to{' '}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredTopics.length)} of {filteredTopics.length} entries
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </div>
      </div>

      {/* Watch Hours by Subject Card (Below Table) */}
      <div className="most-viewed-card">
        <div className="most-viewed-card-header">
          <div className="most-viewed-card-title">
            <HiOutlineClock style={{ color: '#7c3aed', fontSize: 22 }} />
            Watch Hours by Subject
          </div>
        </div>

        {combinedSubjectHours.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>
            No subject watch hour data available.
          </div>
        ) : (
          <div className="subject-hours-grid">
            {combinedSubjectHours.map((sh, idx) => (
              <div className="subject-hour-card" key={idx}>
                <div className="subject-hour-info">
                  <span className="subject-hour-name">{sh.subjectName}</span>
                  <span className="subject-hour-sub">Total watch duration</span>
                </div>
                <span className="subject-hour-val">
                  {(parseFloat(sh.totalWatchHours) || 0).toFixed(1)} hrs
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MostViewedPage;
