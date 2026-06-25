import StatisticCard from '../cards/StatisticCard';

const PartnerStats = ({
  partners,
}) => {
  const total =
    partners.length;

  const active =
    partners.filter(
      (p) =>
        p.status === 'Active'
    ).length;

  const students =
  partners.reduce(
    (sum, p) =>
      sum +
      (Number(
        p.students
      ) || 0),
    0
  );

const revenue =
  partners.reduce(
    (sum, p) =>
      sum +
      (Number(
        p.revenue
      ) || 0),
    0
  );

  const cards = [
    {
      title: 'Total Partners',
      value: total,
      icon: 'partners',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Active Partners',
      value: active,
      icon: 'user-group',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Total Referrals',
      value: students,
      icon: 'students',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Revenue Generated',
      value: '₹' + revenue.toLocaleString(),
      icon: 'commissions',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="dashboard-stats-grid">
      {cards.map((card) => (
        <StatisticCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconBg={card.iconBg}
          iconColor={card.iconColor}
        />
      ))}
    </div>
  );
};

export default PartnerStats;