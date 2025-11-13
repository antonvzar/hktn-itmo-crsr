import { useMemo, useState } from 'react';
import {
  ApartmentOutlined,
  BarChartOutlined,
  DollarOutlined,
  HomeOutlined,
  LoadingOutlined,
  PictureOutlined,
  SaveOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, message, Select, Space, Typography, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import styles from './NewObjectPage.module.css';

type DealType = 'sale' | 'rent';
type BuildingType = 'new' | 'secondary';

interface FormValues {
  title: string;
  city: string;
  address: string;
  price: number;
  area: number;
  floor: number;
  floorsTotal: number;
  rooms: number;
  propertyType: string;
  dealType: DealType;
  description: string;
  tags: string[];
  buildingType: BuildingType;
}

const initialValues: FormValues = {
  title: "Двухкомнатная квартира в ЖК «Горизонт»",
  city: 'Москва',
  address: 'ул. Ленина, д. 45, кв. 112',
  price: 15500000,
  area: 65.5,
  floor: 7,
  floorsTotal: 16,
  rooms: 2,
  propertyType: 'flat',
  dealType: 'sale',
  description:
    "Просторная двухкомнатная квартира с дизайнерским ремонтом в новом жилом комплексе «Горизонт». Панорамные окна, вид на парк. Развитая инфраструктура и закрытая территория.",
  tags: ['exclusive'],
  buildingType: 'new',
};

const formatPrice = (value?: number) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0 }).format(value)
    : '—';

const previewPlaceholder =
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80';

const tagOptions = [
  { value: 'exclusive', label: 'Эксклюзив' },
  { value: 'urgent', label: 'Срочно' },
  { value: 'discount', label: 'Скидка' },
  { value: 'verified', label: 'Проверено' },
];

const NewObjectPage = () => {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '1',
      name: 'living-room.jpg',
      status: 'done',
      url: previewPlaceholder,
    },
    {
      uid: '2',
      name: 'kitchen.jpg',
      status: 'done',
      url: 'https://images.unsplash.com/photo-1616594039964-196d5f2f1f11?auto=format&fit=crop&w=1200&q=80',
    },
  ]);

  const values = Form.useWatch([], form) as FormValues | undefined;
  const currentValues = values ?? initialValues;

  const previewImage = useMemo(() => fileList[0]?.url ?? fileList[0]?.thumbUrl ?? previewPlaceholder, [fileList]);

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Можно загружать только изображения');
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Размер файла не должен превышать 10MB');
    }
    return isImage && isLt10M;
  };

  const handleSubmit = async (publish: boolean) => {
    try {
      setSubmitting(true);
      await form.validateFields();
      await new Promise((resolve) => setTimeout(resolve, 800));
      message.success(publish ? 'Объект сохранён и отправлен на публикацию' : 'Черновик объекта сохранён');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'errorFields' in error &&
        Array.isArray((error as { errorFields?: unknown }).errorFields)
      ) {
        message.error('Проверьте заполнение обязательных полей');
      } else {
        message.error('Не удалось сохранить объект');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Новый объект
        </Typography.Title>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <Form<FormValues>
            layout="vertical"
            form={form}
            initialValues={initialValues}
            onValuesChange={() => {
              /* allows Form.useWatch to update */
            }}
          >
            <div className={styles.section}>
              <Typography.Title level={4} className={styles.sectionTitle}>
                Основная информация
              </Typography.Title>
              <Form.Item
                label="Заголовок"
                name="title"
                rules={[{ required: true, message: 'Введите заголовок' }]}
              >
                <Input placeholder="Например, квартира с видом на парк" />
              </Form.Item>

              <div className={styles.fieldRow}>
                <Form.Item
                  label="Город"
                  name="city"
                  rules={[{ required: true, message: 'Укажите город' }]}
                >
                  <Input placeholder="Москва" />
                </Form.Item>
                <Form.Item
                  label="Адрес"
                  name="address"
                  rules={[{ required: true, message: 'Укажите адрес' }]}
                >
                  <Input placeholder="ул. Ленина, д. 45, кв. 112" />
                </Form.Item>
              </div>
            </div>

            <div className={`${styles.section} ${styles.borderedGroup}`}>
              <Typography.Title level={4} className={styles.sectionTitle}>
                Параметры объекта
              </Typography.Title>

              <div className={styles.fieldRow}>
                <Form.Item
                  label="Площадь, м²"
                  name="area"
                  rules={[{ required: true, message: 'Введите площадь' }]}
                >
                  <InputNumber
                    min={1}
                    step={0.1}
                    style={{ width: '100%' }}
                    placeholder="65.5"
                  />
                </Form.Item>
                <Form.Item
                  label="Этаж"
                  name="floor"
                  rules={[{ required: true, message: 'Укажите этаж' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} placeholder="7" />
                </Form.Item>
                <Form.Item
                  label="Этажность"
                  name="floorsTotal"
                  rules={[{ required: true, message: 'Укажите общее количество этажей' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} placeholder="16" />
                </Form.Item>
                <Form.Item
                  label="Комнаты"
                  name="rooms"
                  rules={[{ required: true, message: 'Укажите количество комнат' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} placeholder="2" />
                </Form.Item>
              </div>

              <div className={styles.fieldRow}>
                <Form.Item
                  label="Тип объекта"
                  name="propertyType"
                  rules={[{ required: true, message: 'Выберите тип объекта' }]}
                >
                  <Select
                    options={[
                      { value: 'flat', label: 'Квартира' },
                      { value: 'house', label: 'Дом' },
                      { value: 'apartment', label: 'Апартаменты' },
                      { value: 'commercial', label: 'Коммерческая недвижимость' },
                    ]}
                    placeholder="Выберите тип"
                  />
                </Form.Item>
                <Form.Item
                  label="Тип сделки"
                  name="dealType"
                  rules={[{ required: true, message: 'Выберите тип сделки' }]}
                >
                  <Select
                    options={[
                      { value: 'sale', label: 'Продажа' },
                      { value: 'rent', label: 'Аренда' },
                    ]}
                    placeholder="Выберите тип"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Цена, ₽"
                name="price"
                rules={[{ required: true, message: 'Укажите цену' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '')}
                  placeholder="15 500 000"
                />
              </Form.Item>
            </div>

            <div className={`${styles.section} ${styles.borderedGroup}`}>
              <Typography.Title level={4} className={styles.sectionTitle}>
                Фотографии и описание
              </Typography.Title>

              <Form.Item label="Фотографии">
                <Upload.Dragger
                  multiple
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  onChange={handleUploadChange}
                  listType="picture"
                  className={styles.upload}
                  itemRender={(originNode) => originNode}
                >
                  <p className="ant-upload-drag-icon">
                    <PictureOutlined />
                  </p>
                  <p className="ant-upload-text">Перетащите файлы сюда</p>
                  <p className="ant-upload-hint">или нажмите, чтобы выбрать. PNG, JPG, GIF до 10MB</p>
                </Upload.Dragger>
              </Form.Item>

              <div className={styles.galleryGrid}>
                {fileList.slice(0, 4).map((file) => (
                  <img key={file.uid} src={file.url ?? file.thumbUrl} alt={file.name} className={styles.galleryImage} />
                ))}
                {Array.from({ length: Math.max(0, 4 - fileList.length) }).map((_, index) => (
                  <div key={`placeholder-${index}`} className={styles.galleryPlaceholder} />
                ))}
              </div>

              <Form.Item
                label="Описание"
                name="description"
                rules={[{ required: true, message: 'Добавьте описание объекта' }]}
              >
                <Input.TextArea rows={5} placeholder="Расскажите об особенностях объекта" />
              </Form.Item>
            </div>

            <div className={`${styles.section} ${styles.borderedGroup}`}>
              <Typography.Title level={4} className={styles.sectionTitle}>
                Дополнительно
              </Typography.Title>

              <Form.Item label="Теги">
                <Form.Item name="tags" noStyle>
                  <Select mode="multiple" options={tagOptions} style={{ display: 'none' }} />
                </Form.Item>
                <div className={styles.tagGroup}>
                  {tagOptions.map((tag) => {
                    const active = currentValues.tags?.includes(tag.value);
                    return (
                      <span
                        key={tag.value}
                        className={`${styles.tagToggle} ${active ? styles.tagToggleActive : ''}`}
                        onClick={() => {
                          const next = new Set(currentValues.tags ?? []);
                          if (active) {
                            next.delete(tag.value);
                          } else {
                            next.add(tag.value);
                          }
                          form.setFieldsValue({ tags: Array.from(next) });
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            const next = new Set(currentValues.tags ?? []);
                            if (active) {
                              next.delete(tag.value);
                            } else {
                              next.add(tag.value);
                            }
                            form.setFieldsValue({ tags: Array.from(next) });
                          }
                        }}
                      >
                        {tag.label}
                      </span>
                    );
                  })}
                </div>
              </Form.Item>

              <Form.Item label="Тип дома">
                <Form.Item name="buildingType" noStyle>
                  <Input style={{ display: 'none' }} />
                </Form.Item>
                <div className={styles.radioGroup}>
                  {(
                    [
                      { value: 'new', label: 'Новостройка' },
                      { value: 'secondary', label: 'Вторичка' },
                    ] as const
                  ).map((option) => {
                    const active = currentValues.buildingType === option.value;
                    return (
                      <span
                        key={option.value}
                        className={styles.radioOption}
                        role="radio"
                        aria-checked={active}
                        tabIndex={0}
                        onClick={() => form.setFieldsValue({ buildingType: option.value })}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            form.setFieldsValue({ buildingType: option.value });
                          }
                        }}
                      >
                        <span className={`${styles.radioBullet} ${active ? styles.radioBulletActive : ''}`}>
                          {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                        </span>
                        {option.label}
                      </span>
                    );
                  })}
                </div>
              </Form.Item>
            </div>
          </Form>

          <div className={styles.footer}>
            <Button
              type="default"
              className={styles.secondaryButton}
              icon={<SaveOutlined />}
              loading={submitting}
              onClick={() => handleSubmit(false)}
            >
              Сохранить
            </Button>
            <Button
              type="primary"
              className={styles.primaryButton}
              icon={submitting ? <LoadingOutlined /> : <DollarOutlined />}
              loading={submitting}
              onClick={() => handleSubmit(true)}
            >
              Сохранить и опубликовать
            </Button>
          </div>
        </div>

        <Card className={`${styles.card} ${styles.previewCard}`} bodyStyle={{ padding: 0 }}>
          <div className={styles.previewMedia}>
            <img src={previewImage} alt="Предпросмотр объекта" className={styles.previewCover} />
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Space size={8}>
              {currentValues.tags?.includes('exclusive') && (
                <span className={styles.previewTag}>Эксклюзив</span>
              )}
              {currentValues.tags?.includes('urgent') && (
                <span className={styles.previewTag} style={{ background: '#fde68a', color: '#b45309' }}>
                  Срочно
                </span>
              )}
            </Space>
            <div className={styles.previewInfo}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {formatPrice(currentValues.price)} ₽
              </Typography.Title>
              <Typography.Text strong>{currentValues.title}</Typography.Text>
              <Typography.Text type="secondary">
                {currentValues.city}, {currentValues.address}
              </Typography.Text>
            </div>
            <div className={styles.previewStats}>
              <span className={styles.previewStat}>
                <HomeOutlined />
                {currentValues.rooms} комн.
              </span>
              <span className={styles.previewStat}>
                <BarChartOutlined />
                {currentValues.floor}/{currentValues.floorsTotal} эт.
              </span>
              <span className={styles.previewStat}>
                <ApartmentOutlined />
                {currentValues.area} м²
              </span>
            </div>
            <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 3 }}>
              {currentValues.description}
            </Typography.Paragraph>
            <Space direction="vertical" size={8}>
              <Space size={6}>
                <TagsOutlined style={{ color: '#6b778c' }} />
                <Typography.Text type="secondary">
                  {currentValues.tags?.length ? currentValues.tags.map((tag) => tagOptions.find((t) => t.value === tag)?.label ?? tag).join(', ') : 'Без тегов'}
                </Typography.Text>
              </Space>
              <Space size={6}>
                <HomeOutlined style={{ color: '#6b778c' }} />
                <Typography.Text type="secondary">
                  {currentValues.buildingType === 'new' ? 'Новостройка' : 'Вторичка'}
                </Typography.Text>
              </Space>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NewObjectPage;
