export type FieldType = 'text' | 'textarea' | 'select' | 'file' | 'time' | 'email' | 'tel' | 'url' | 'number' | 'address-autocomplete';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  /** Used for select dropdowns */
  options?: { label: string; value: string }[];
  /** If true, the field takes up half the width in a grid (useful for desktop layouts) */
  halfWidth?: boolean;
  /** Accepts attribute for file inputs, e.g., 'image/*' */
  accept?: string;
}

export interface FormSection {
  title: string;
  fields: FormField[];
}

export interface GenericFormProps {
  /** Configuration array describing the sections and fields */
  sections: FormSection[];
  /** Initial form data for editing or default values */
  initialData?: any;
  /** Submit handler */
  onSubmit: (data: any) => Promise<void>;
  /** Indicates if this form is used for editing */
  isEdit?: boolean;
  /** Label for submit button */
  submitLabel?: string;
  /** Label when loading/submitting */
  loadingLabel?: string;
}
