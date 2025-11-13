import { useMemo, useState } from 'react';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Segmented, Typography, Button } from 'antd';
import ProposalCard, { ProposalCardData } from '../../components/deals/ProposalCard';
import styles from './DealsPage.module.css';

const { Title, Text, Paragraph } = Typography;

type DealsTab = 'incoming' | 'outgoing';

const incomingProposals: ProposalCardData[] = [
  {
    id: 'proposal-1',
    authorName: 'Elena Smirnova',
    authorInitials: 'ES',
    title: 'В поисках трёхкомнатной квартиры в центре города',
    description: 'Клиент готов оформить сделку в течение месяца. Рассматриваем объекты с панорамными окнами и паркингом.',
    imageUrl: 'https://images.unsplash.com/photo-1616628182501-eho85NXWXTE?auto=format&fit=crop&w=1280&q=80',
    createdAt: '2 часа назад',
  },
  {
    id: 'proposal-2',
    authorName: 'Alexey Volkov',
    authorInitials: 'AV',
    title: 'Клиент ищет современное офисное помещение, 200-300 кв.м',
    description: 'Нужен офис в бизнес-центре класса А в пределах ТТК. Важны парковка и возможность гибкой планировки.',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1280&q=80',
    createdAt: '6 часов назад',
  },
  {
    id: 'proposal-3',
    authorName: 'Olga Popova',
    authorInitials: 'OP',
    title: 'Запрос на современный дом в пригороде',
    description: 'Клиент ищет дом площадью 250-300 кв.м с участком от 10 соток в радиусе 20 км от города.',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1280&q=80',
    createdAt: 'Вчера',
  },
];

const outgoingProposals: ProposalCardData[] = [
  {
    id: 'proposal-4',
    authorName: 'Lead Exchange',
    authorInitials: 'LE',
    title: 'Предложение обмена клиентами по премиум-объектам',
    description: 'У нас есть покупатели на премиум-квартиры в Москве. Давайте обменяемся клиентской базой для ускорения сделок.',
    imageUrl: 'https://images.unsplash.com/photo-1529429617124-aee01c44c29d?auto=format&fit=crop&w=1280&q=80',
    createdAt: '3 дня назад',
  },
];

const DealsPage = () => {
  const [tab, setTab] = useState<DealsTab>('incoming');

  const proposals = useMemo(() => (tab === 'incoming' ? incomingProposals : outgoingProposals), [tab]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <Title level={2} style={{ margin: 0 }}>
            Предложения о сотрудничестве
          </Title>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Отвечайте на запросы коллег и находите партнёров для совместных сделок.
          </Paragraph>
        </div>
        <div className={styles.actions}>
          <Segmented
            className={styles.tabBar}
            value={tab}
            onChange={(value) => setTab(value as DealsTab)}
            options={[
              { label: 'Входящие', value: 'incoming' },
              { label: 'Исходящие', value: 'outgoing' },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} className={styles.newProposalButton}>
            Новое предложение
          </Button>
        </div>
      </div>

      <div className={styles.grid}>
        {proposals.length > 0 ? (
          proposals.map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} />)
        ) : (
          <div className={styles.placeholderCard}>
            <div className={styles.placeholderIcon}>
              <InboxOutlined />
            </div>
            <Title level={5} style={{ margin: 0 }}>
              Нет предложений
            </Title>
            <Text type="secondary">Попробуйте переключиться на другую вкладку или создайте новое предложение.</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage;
