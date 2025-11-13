import { useEffect, useMemo, useState } from 'react';
import {
  AppstoreOutlined,
  CloudDownloadOutlined,
  ReloadOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Button, Pagination, Segmented, Select, Space, Typography } from 'antd';
import LeadFilters, { LeadFiltersValue } from '../../components/leads/LeadFilters';
import LeadCard, { LeadCardData } from '../../components/leads/LeadCard';
import styles from './LeadsCatalogPage.module.css';

const { Title, Text } = Typography;

interface Lead extends LeadCardData {
  cityCode: string;
}

const allLeads: Lead[] = [
  {
    id: 'lead-1',
    city: 'Москва',
    cityCode: 'moscow',
    dealType: 'sale',
    propertyType: 'flat',
    rooms: 3,
    budgetFrom: 15000000,
    budgetTo: 20000000,
    source: 'Циан',
    matchPercent: 92,
    contact: { name: 'Иван П.', phone: '+7 9** *** ** 12', email: 'i***@mail.ru' },
    exclusive: true,
  },
  {
    id: 'lead-2',
    city: 'Санкт-Петербург',
    cityCode: 'saint-petersburg',
    dealType: 'rent',
    propertyType: 'house',
    rooms: '5+',
    budgetLabel: 'Бюджет: 80-100k ₽ в мес.',
    source: 'Avito',
    matchPercent: 78,
    contact: { name: 'Мария К.', phone: '+7 9** *** ** 45', email: 'm***@gmail.com' },
  },
  {
    id: 'lead-3',
    city: 'Москва',
    cityCode: 'moscow',
    dealType: 'sale',
    propertyType: 'flat',
    rooms: 1,
    budgetFrom: 8000000,
    budgetTo: 10000000,
    source: 'Звонок',
    matchPercent: 45,
    contact: { name: 'Алексей С.', phone: '+7 9** *** ** 99', email: 'a***@yandex.ru' },
  },
  {
    id: 'lead-4',
    city: 'Казань',
    cityCode: 'kazan',
    dealType: 'sale',
    propertyType: 'apartment',
    rooms: 2,
    budgetFrom: 9500000,
    budgetTo: 11000000,
    source: 'Lead Exchange',
    matchPercent: 84,
    contact: { name: 'Ольга Р.', phone: '+7 9** *** ** 07', email: 'o***@mail.ru' },
    exclusive: true,
  },
  {
    id: 'lead-5',
    city: 'Екатеринбург',
    cityCode: 'yekaterinburg',
    dealType: 'rent',
    propertyType: 'commercial',
    rooms: '4+',
    budgetLabel: 'Бюджет: 200-300k ₽ в мес.',
    source: 'Сарафанное радио',
    matchPercent: 65,
    contact: { name: 'Светлана Н.', phone: '+7 9** *** ** 51', email: 's***@corp.ru' },
  },
  {
    id: 'lead-6',
    city: 'Москва',
    cityCode: 'moscow',
    dealType: 'sale',
    propertyType: 'house',
    rooms: 4,
    budgetFrom: 32000000,
    budgetTo: 36000000,
    source: 'Личный сайт',
    matchPercent: 88,
    contact: { name: 'Павел Т.', phone: '+7 9** *** ** 33', email: 'p***@mail.ru' },
  },
];

const pageSize = 9;
const totalLeads = 1234;

const LeadsCatalogPage = () => {
  const [filters, setFilters] = useState<LeadFiltersValue>({});
  const [sort, setSort] = useState<'fresh' | 'match-desc' | 'budget-desc' | 'budget-asc'>('fresh');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      if (filters.city && lead.cityCode !== filters.city) {
        return false;
      }
      if (filters.dealType && lead.dealType !== filters.dealType) {
        return false;
      }
      if (filters.propertyType && lead.propertyType !== filters.propertyType) {
        return false;
      }
      if (filters.exclusive && !lead.exclusive) {
        return false;
      }
      if (filters.rooms) {
        if (filters.rooms === '4+') {
          const roomsCount = typeof lead.rooms === 'number' ? lead.rooms : Number.parseInt(`${lead.rooms}`, 10);
          if (!Number.isNaN(roomsCount) && roomsCount < 4) {
            return false;
          }
          if (lead.rooms === '1' || lead.rooms === '2' || lead.rooms === '3') {
            return false;
          }
        } else if (`${lead.rooms}` !== filters.rooms) {
          return false;
        }
      }
      if (filters.budgetFrom || filters.budgetTo) {
        const min = lead.budgetFrom ?? lead.budgetTo ?? 0;
        const max = lead.budgetTo ?? lead.budgetFrom ?? min;
        if (filters.budgetFrom && max < filters.budgetFrom) {
          return false;
        }
        if (filters.budgetTo && min > filters.budgetTo) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  const sortedLeads = useMemo(() => {
    const next = [...filteredLeads];
    switch (sort) {
      case 'match-desc':
        next.sort((a, b) => b.matchPercent - a.matchPercent);
        break;
      case 'budget-desc':
        next.sort(
          (a, b) =>
            (b.budgetTo ?? b.budgetFrom ?? 0) - (a.budgetTo ?? a.budgetFrom ?? 0),
        );
        break;
      case 'budget-asc':
        next.sort(
          (a, b) =>
            (a.budgetFrom ?? a.budgetTo ?? 0) - (b.budgetFrom ?? b.budgetTo ?? 0),
        );
        break;
      default:
        break;
    }
    return next;
  }, [filteredLeads, sort]);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, currentPage]);

  const startRange = sortedLeads.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, sortedLeads.length);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <Title level={2} style={{ margin: 0 }}>
            Каталог лидов
          </Title>
          <Text type="secondary">Подберите релевантные запросы клиентов и расширяйте воронку.</Text>
        </div>
        <div className={styles.actions}>
          <Button icon={<ReloadOutlined />} />
          <Button icon={<CloudDownloadOutlined />}>Экспорт</Button>
          <Button type="primary" size="large" className={styles.primaryAction}>
            Создать подборку
          </Button>
        </div>
      </div>

      <div className={styles.layout}>
        <LeadFilters value={filters} onChange={setFilters} />
        <div>
          <div className={styles.listHeader}>
            <div className={styles.listMeta}>
              <Text className={styles.resultsCount}>
                Найдено {totalLeads.toLocaleString('ru-RU')} лида
              </Text>
              <Text type="secondary">
                Отфильтровано: {sortedLeads.length} результатов
              </Text>
            </div>
            <Space size={12} wrap>
              <Select
                value={sort}
                onChange={(value) => setSort(value)}
                className={styles.sortSelect}
                options={[
                  { value: 'fresh', label: 'По свежести' },
                  { value: 'match-desc', label: 'По совпадению' },
                  { value: 'budget-desc', label: 'Бюджет по убыванию' },
                  { value: 'budget-asc', label: 'Бюджет по возрастанию' },
                ]}
              />
              <Segmented
                value={view}
                onChange={(value) => setView(value as 'list' | 'grid')}
                className={styles.viewToggle}
                options={[
                  { value: 'list', icon: <TableOutlined /> },
                  { value: 'grid', icon: <AppstoreOutlined /> },
                ]}
              />
            </Space>
          </div>

          <div className={view === 'grid' ? styles.leadsGrid : styles.leadsList}>
            {paginatedLeads.length > 0 ? (
              paginatedLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
            ) : (
              <div className={styles.emptyState}>Нет лидов, удовлетворяющих текущим фильтрам.</div>
            )}
          </div>

          <div className={styles.footer}>
            <Text>
              Показано{' '}
              {startRange === 0 && endRange === 0
                ? '0'
                : `${startRange}–${endRange}`} из {sortedLeads.length} результатов
            </Text>
            <div className={styles.pagination}>
              <Pagination
                total={sortedLeads.length}
                pageSize={pageSize}
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsCatalogPage;
