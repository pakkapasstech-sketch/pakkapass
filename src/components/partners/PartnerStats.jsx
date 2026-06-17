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
        sum + p.students,
      0
    );

  const revenue =
    partners.reduce(
      (sum, p) =>
        sum + p.revenue,
      0
    );

  const cards = [
    {
      title:
        'Total Partners',
      value: total,
    },
    {
      title:
        'Active Partners',
      value: active,
    },
    {
      title:
        'Total Referrals',
      value: students,
    },
    {
      title:
        'Revenue Generated',
      value:
        '₹' +
        revenue.toLocaleString(),
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div
          key={card.title}
          className="stat-card"
        >
          <h3>
            {card.value}
          </h3>

          <p>
            {card.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PartnerStats;