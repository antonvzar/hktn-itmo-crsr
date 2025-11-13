import { Button, Tooltip } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import styles from './LeadCard.module.css';
import type { LeadDealType } from './LeadFilters';

export interface LeadContact {
  name: string;
  phone: string;
  email: string;
}

export interface LeadCardData {
  id: string;
  city: string;
  dealType: LeadDealType;
  propertyType: string;
  rooms: number | '1' | '2' | '3' | '4+' | '5+';
  budgetLabel?: string;
  budgetFrom?: number;
  budgetTo?: number;
  source: string;
  contact: LeadContact;
  matchPercent: number;
  exclusive?: boolean;
}

interface LeadCardProps {
  lead: LeadCardData;
  onOpenContacts?: (leadId: string) => void;
  onBookmark?: (leadId: string) => void;
}

const dealTypeLabel: Record<LeadDealType, string> = {
  sale: 'Продажа',
  rent: 'Аренда',
};

const propertyTypeLabel: Record<string, string> = {
  flat: 'Квартира',
  house: 'Дом',
  apartment: 'Апартаменты',
  commercial: 'Коммерческая недвижимость',
};

const formatBudget = (lead: LeadCardData) => {
  if (lead.budgetLabel) return lead.budgetLabel;
  if (!lead.budgetFrom && !lead.budgetTo) return undefined;
  const formatter = new Intl.NumberFormat('ru-RU');
  const from = lead.budgetFrom ? formatter.format(lead.budgetFrom) : undefined;
  const to = lead.budgetTo ? formatter.format(lead.budgetTo) : undefined;
  if (from && to) {
    return `Бюджет: ${from}–${to} ₽`;
  }
  if (from) {
    return `Бюджет от ${from} ₽`;
  }
  return `Бюджет до ${to} ₽`;
};

const formatPropertyType = (value: string) => propertyTypeLabel[value] ?? value;

const getScoreClassName = (matchPercent: number) => {
  if (matchPercent >= 80) return styles.scoreHigh;
  if (matchPercent >= 60) return styles.scoreMedium;
  return styles.scoreLow;
};

const LeadCard = ({ lead, onOpenContacts, onBookmark }: LeadCardProps) => {
  const title = `${lead.city} · ${dealTypeLabel[lead.dealType]} · ${formatPropertyType(lead.propertyType)}`;
  const budget = formatBudget(lead);
  const roomsLabel = typeof lead.rooms === 'number' ? `${lead.rooms}` : lead.rooms;

  return (
    <article className={styles.card} aria-label={`Лид: ${title}`}>
      <div className={styles.topRow}>
        <div>
          <h4 className={styles.leadTitle}>{title}</h4>
          <div className={styles.meta}>
            {lead.exclusive && <span className={`${styles.badge} ${styles.exclusiveBadge}`}>Эксклюзив</span>}
            {budget && <span className={`${styles.badge} ${styles.budgetBadge}`}>{budget}</span>}
            <span className={styles.metaItem}>Комнат: {roomsLabel}</span>
            <span className={styles.metaItem}>Источник: {lead.source}</span>
          </div>
        </div>
        <div className={styles.score}>
          <div className={`${styles.scoreBadge} ${getScoreClassName(lead.matchPercent)}`}>{lead.matchPercent}%</div>
          <span className={styles.scoreLabel}>совпадение</span>
        </div>
      </div>

      <div className={styles.contactRow}>
        <div className={styles.contactInfo}>
          <span className={styles.contactName}>{lead.contact.name}</span>
          <span className={styles.contactDetail}>{lead.contact.phone}</span>
          <span className={styles.contactDetail}>{lead.contact.email}</span>
        </div>
        <div className={styles.actions}>
          <Button type="primary" size="large" className={styles.openButton} onClick={() => onOpenContacts?.(lead.id)}>
            Открыть контакты
          </Button>
          <Tooltip title="Добавить в избранное">
            <Button
              type="text"
              shape="circle"
              icon={<StarOutlined />}
              className={styles.bookmarkButton}
              onClick={() => onBookmark?.(lead.id)}
            />
          </Tooltip>
        </div>
      </div>
    </article>
  );
};

export default LeadCard;
