

export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'file'
  | 'location';

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FormField<T = any> {
  name: Extract<keyof T, string> | string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[]; // for select, radio
  accept?: string; // for file input
  validation?: (value: any, formValues: any) => string | undefined; // returns error message if invalid
  halfWidth?: boolean; // For grid layout styling
}

export interface CommonFormProps<T = any> {
  fields: FormField<T>[];
  initialValues?: Partial<T>;
  mode?: 'add' | 'edit';
  onSubmit: (data: any) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}
