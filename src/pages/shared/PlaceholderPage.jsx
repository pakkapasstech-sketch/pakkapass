import EmptyState from '../../components/loaders/EmptyState';

const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <EmptyState title={title} description="This module is under development. API integration is ready." />
  </div>
);

export default PlaceholderPage;
