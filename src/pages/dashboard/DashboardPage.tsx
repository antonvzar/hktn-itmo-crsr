import { useMemo, useState } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import styles from './DashboardPage.module.css';

type TrendType = 'up' | 'down' | 'neutral';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  image: string;
}

interface Metric {
  id: string;
  label: string;
  value: string;
  trendLabel: string;
  trendType: TrendType;
}

const { Title, Text, Paragraph } = Typography;

const recommendations: Recommendation[] = [
  {
    id: 'moscow-hot',
    title: 'Горячие лиды в Москве',
    description: '5 новых премиум-лидов доступны в вашем районе.',
    actionLabel: 'Посмотреть',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'colleague-match',
    title: 'Свяжитесь с коллегой',
    description: 'У Алексея П. есть подходящий объект для вашего клиента.',
    actionLabel: 'Написать',
    image: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'top-up',
    title: 'Пополните баланс',
    description: 'Получите доступ к премиум-лидам и расширенным функциям.',
    actionLabel: 'Пополнить',
    image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=80',
  },
];

const metrics: Metric[] = [
  { id: 'objects', label: 'Мои объекты', value: '42', trendLabel: '+2', trendType: 'up' },
  { id: 'new-leads', label: 'Новые лиды', value: '125', trendLabel: '+15%', trendType: 'up' },
  { id: 'conversion', label: 'Конверсия', value: '8.7%', trendLabel: '-1.2%', trendType: 'down' },
  { id: 'freshness', label: 'Свежесть лидов', value: '3 дня', trendLabel: '-1', trendType: 'neutral' },
];

const chartCards = [
  { id: 'leads-by-day', title: 'Лиды по дням' },
  { id: 'property-types', title: 'Типы объектов' },
  { id: 'credits-spending', title: 'Расход кредитов' },
];

const trendIconMap: Record<TrendType, React.ReactNode> = {
  up: <ArrowUpOutlined />,
  down: <ArrowDownOutlined />,
  neutral: <MinusOutlined />,
};

const trendClassNameMap: Record<TrendType, string> = {
  up: styles.trendUp,
  down: styles.trendDown,
  neutral: styles.trendNeutral,
};

const DashboardPage = () => {
  const [metricsRange, setMetricsRange] = useState<'7' | '30' | '90'>('30');

  const filters = useMemo(
    () => [
      { id: '7' as const, label: '7 дней' },
      { id: '30' as const, label: '30 дней' },
      { id: '90' as const, label: '90 дней' },
    ],
    [],
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <Title level={2} style={{ marginBottom: 0 }}>
            Дашборд
          </Title>
          <Paragraph style={{ marginBottom: 0, color: '#4567A1' }}>Обзор вашей активности и инсайты от ИИ.</Paragraph>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} className={styles.actionButton}>
          Перейти в каталог лидов
        </Button>
      </div>

      <section className={styles.recommendations} aria-labelledby="ai-recommendations">
        <div className={styles.recommendationsHeader}>
          <Title id="ai-recommendations" level={4} style={{ margin: 0 }}>
            Рекомендации от ИИ
          </Title>
        </div>
        <div className={styles.recommendationsGrid}>
          {recommendations.map((item) => (
            <Card key={item.id} hoverable cover={<img alt="" src={item.image} />} className={styles.recommendationCard}>
              <Space direction="vertical" size={8}>
                <Title level={5} style={{ margin: 0 }}>
                  {item.title}
                </Title>
                <Text type="secondary">{item.description}</Text>
              </Space>
              <Button className={styles.outlinedButton}>{item.actionLabel}</Button>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.metricsSection} aria-labelledby="key-metrics">
        <div className={styles.metricsHeader}>
          <Title id="key-metrics" level={4} style={{ margin: 0 }}>
            Ключевые показатели
          </Title>
          <div className={styles.metricsFilters} role="group" aria-label="Фильтр периода">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setMetricsRange(filter.id)}
                className={filter.id === metricsRange ? 'active' : undefined}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.metricsGrid}>
          {metrics.map((metric) => (
            <div key={metric.id} className={styles.metricCard}>
              <div className={styles.metricTop}>
                <Text type="secondary">{metric.label}</Text>
                <span className={`${styles.trend} ${trendClassNameMap[metric.trendType]}`}>
                  {trendIconMap[metric.trendType]}
                  {metric.trendLabel}
                </span>
              </div>
              <Title level={2} style={{ margin: '8px 0 0 0' }}>
                {metric.value}
              </Title>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.chartsGrid} aria-label="Графики и аналитика">
        {chartCards.map((chart) => (
          <div key={chart.id} className={styles.chartCard}>
            <Title level={4} style={{ margin: 0 }}>
              {chart.title}
            </Title>
            <div className={styles.chartPlaceholder}>График появится здесь</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DashboardPage;
