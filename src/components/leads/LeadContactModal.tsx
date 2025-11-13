import { Avatar, Button, Modal, Space, Typography } from 'antd';
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useMemo } from 'react';
import type { LeadCardData } from './LeadCard';
import styles from './LeadContactModal.module.css';

interface LeadContactModalProps {
  lead?: LeadCardData | null;
  open: boolean;
  onClose: () => void;
}

const { Title, Text } = Typography;

const LeadContactModal = ({ lead, open, onClose }: LeadContactModalProps) => {
  const budgetLabel = useMemo(() => {
    if (!lead) return undefined;
    if (lead.budgetLabel) return lead.budgetLabel;
    const formatter = new Intl.NumberFormat('ru-RU');
    if (lead.budgetFrom && lead.budgetTo) {
      return `Бюджет: ${formatter.format(lead.budgetFrom)}–${formatter.format(lead.budgetTo)} ₽`;
    }
    if (lead.budgetFrom) {
      return `Бюджет от ${formatter.format(lead.budgetFrom)} ₽`;
    }
    if (lead.budgetTo) {
      return `Бюджет до ${formatter.format(lead.budgetTo)} ₽`;
    }
    return undefined;
  }, [lead]);

  return (
    <Modal
      open={open}
      width={520}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      title={null}
    >
      {lead && (
        <div className={styles.modalCard}>
          <div className={styles.header}>
            <Avatar size={56}>{lead.contact.name.slice(0, 2).toUpperCase()}</Avatar>
            <div className={styles.headerInfo}>
              <Title level={4} style={{ margin: 0 }}>
                {lead.contact.name}
              </Title>
              <Text type="secondary">Лид из {lead.city}</Text>
            </div>
          </div>

          <div className={styles.dealMeta}>
            <span className={styles.badge}>
              <TeamOutlined />
              {lead.dealType === 'sale' ? 'Продажа' : 'Аренда'}
            </span>
            <span className={styles.badge}>
              <EnvironmentOutlined /> {lead.city}
            </span>
            {budgetLabel && <span className={`${styles.badge} ${styles.budgetBadge}`}>{budgetLabel}</span>}
          </div>

          <div className={styles.contactSection} aria-label="Контактная информация">
            <div className={styles.contactRow}>
              <PhoneOutlined style={{ color: '#1f71ff' }} />
              <div>
                <div className={styles.contactLabel}>Телефон</div>
                <Text>{lead.contact.phone.replace(/\*/g, '•')}</Text>
              </div>
            </div>
            <div className={styles.contactRow}>
              <MailOutlined style={{ color: '#1f71ff' }} />
              <div>
                <div className={styles.contactLabel}>Email</div>
                <Text>{lead.contact.email.replace(/\*/g, '•')}</Text>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button type="primary" className={styles.primaryAction} onClick={onClose}>
              Открыть карточку сделки
            </Button>
            <Button className={styles.secondaryAction} onClick={onClose}>
              Добавить заметку
            </Button>
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Контакты защищены: вместо «*» отображены символы безопасности.
              </Text>
            </Space>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default LeadContactModal;
