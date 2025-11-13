import { Avatar, Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import styles from './ProposalCard.module.css';

export interface ProposalCardData {
  id: string;
  authorName: string;
  authorInitials: string;
  authorAvatar?: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt?: string;
}

interface ProposalCardProps {
  proposal: ProposalCardData;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onOpenChat?: (id: string) => void;
}

const ProposalCard = ({ proposal, onAccept, onReject, onOpenChat }: ProposalCardProps) => (
  <article className={styles.card} aria-label={`Предложение от ${proposal.authorName}`}>
    <img src={proposal.imageUrl} alt={proposal.title} className={styles.cover} />
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.author}>
          <Avatar size={42} src={proposal.authorAvatar}>
            {proposal.authorInitials}
          </Avatar>
          <div className={styles.authorInfo}>
            <span className={styles.authorLabel}>От: {proposal.authorName}</span>
            {proposal.createdAt && <span className={styles.timestamp}>{proposal.createdAt}</span>}
          </div>
        </div>
      </div>

      <h4 className={styles.title}>{proposal.title}</h4>
      <p className={styles.description}>{proposal.description}</p>

      <div className={styles.actions}>
        <Button className={`${styles.actionButton} ${styles.rejectButton}`} onClick={() => onReject?.(proposal.id)}>
          Отказать
        </Button>
        <Button className={`${styles.actionButton} ${styles.acceptButton}`} onClick={() => onAccept?.(proposal.id)}>
          Согласиться
        </Button>
      </div>

      <button type="button" className={styles.chatButton} onClick={() => onOpenChat?.(proposal.id)}>
        <MessageOutlined />
        Открыть чат
      </button>
    </div>
  </article>
);

export default ProposalCard;
