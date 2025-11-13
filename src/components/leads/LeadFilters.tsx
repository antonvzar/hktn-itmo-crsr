import { useEffect } from 'react';
import { Button, Checkbox, Form, InputNumber, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import styles from './LeadFilters.module.css';

export type LeadDealType = 'sale' | 'rent';

export interface LeadFiltersValue {
  city?: string;
  dealType?: LeadDealType;
  propertyType?: string;
  budgetFrom?: number;
  budgetTo?: number;
  rooms?: '1' | '2' | '3' | '4+';
  exclusive?: boolean;
}

interface LeadFiltersProps {
  value?: LeadFiltersValue;
  onChange?: (value: LeadFiltersValue) => void;
  onApply?: (value: LeadFiltersValue, form: FormInstance<LeadFiltersValue>) => void;
  onReset?: () => void;
}

const cityOptions = [
  { value: 'moscow', label: 'Москва' },
  { value: 'saint-petersburg', label: 'Санкт-Петербург' },
  { value: 'kazan', label: 'Казань' },
  { value: 'yekaterinburg', label: 'Екатеринбург' },
];

const dealOptions = [
  { value: 'sale', label: 'Продажа' },
  { value: 'rent', label: 'Аренда' },
];

const propertyOptions = [
  { value: 'flat', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'apartment', label: 'Апартаменты' },
  { value: 'commercial', label: 'Коммерческая недвижимость' },
];

const roomOptions: Array<LeadFiltersValue['rooms']> = ['1', '2', '3', '4+'];

const LeadFilters = ({ value, onChange, onApply, onReset }: LeadFiltersProps) => {
  const [form] = Form.useForm<LeadFiltersValue>();

  useEffect(() => {
    if (value) {
      form.setFieldsValue(value);
    }
  }, [value, form]);

  const emitChange = (next: LeadFiltersValue) => {
    onChange?.(next);
  };

  const handleValuesChange = (_: unknown, allValues: LeadFiltersValue) => {
    emitChange(allValues);
  };

  const handleRoomToggle = (room?: LeadFiltersValue['rooms']) => {
    const current = form.getFieldValue('rooms');
    const next = current === room ? undefined : room;
    form.setFieldsValue({ rooms: next });
    emitChange(form.getFieldsValue());
  };

  const handleReset = () => {
    form.resetFields();
    const emptyValue: LeadFiltersValue = {};
    emitChange(emptyValue);
    onReset?.();
  };

  const handleApply = () => {
    onApply?.(form.getFieldsValue(), form);
  };

  const selectedRoom = form.getFieldValue('rooms');

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Фильтры</h3>
        <button type="button" className={styles.resetButton} onClick={handleReset}>
          Сбросить
        </button>
      </div>

      <Form
        form={form}
        layout="vertical"
        className={styles.form}
        initialValues={value}
        onValuesChange={handleValuesChange}
      >
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Локация</span>
          <Form.Item label="Город" name="city">
            <Select placeholder="Выберите город" options={cityOptions} allowClear />
          </Form.Item>
        </div>

        <div className={styles.section}>
          <span className={styles.sectionTitle}>Параметры сделки</span>
          <Form.Item label="Тип сделки" name="dealType">
            <Select placeholder="Выберите тип" options={dealOptions} allowClear />
          </Form.Item>

          <Form.Item label="Тип объекта" name="propertyType">
            <Select placeholder="Выберите тип" options={propertyOptions} allowClear />
          </Form.Item>

          <div className={styles.inlineGroup}>
            <Form.Item label="Бюджет, ₽" name="budgetFrom">
              <InputNumber placeholder="от" min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="&nbsp;" colon={false} name="budgetTo">
              <InputNumber placeholder="до" min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item label="Комнаты">
            <div className={styles.roomsGroup}>
              {roomOptions.map((room) => (
                <button
                  key={room}
                  type="button"
                  className={`${styles.roomButton} ${selectedRoom === room ? styles.roomButtonActive : ''}`}
                  onClick={() => handleRoomToggle(room)}
                >
                  {room}
                </button>
              ))}
            </div>
          </Form.Item>

          <Form.Item valuePropName="checked" name="exclusive">
            <Checkbox>Только эксклюзив</Checkbox>
          </Form.Item>
        </div>
      </Form>

      <div className={styles.actions}>
        <Button type="primary" className={styles.applyButton} onClick={handleApply}>
          Применить фильтр
        </Button>
        <Button className={styles.clearButton} onClick={handleReset}>
          Очистить
        </Button>
      </div>
    </div>
  );
};

export default LeadFilters;
