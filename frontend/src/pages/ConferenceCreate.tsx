import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, GripVertical, Plus } from 'lucide-react';
import { api } from '../services/api';
import { FormField, FieldType } from '../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableFieldItemProps {
  field: Partial<FormField>;
  index: number;
  updateField: (index: number, updates: Partial<FormField>) => void;
  removeField: (index: number) => void;
  insertFieldBelow: (index: number) => void;
  canRemove: boolean;
}

function SortableFieldItem({
  field,
  index,
  updateField,
  removeField,
  insertFieldBelow,
  canRemove,
}: SortableFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `field-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors">
        <div className="flex items-start gap-2">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 mt-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <GripVertical size={18} />
          </div>

          {/* Field Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    updateField(index, { label, fieldName: slug });
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Field Name</label>
                <input
                  type="text"
                  value={field.fieldName}
                  onChange={(e) => updateField(index, { fieldName: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
                  placeholder="firstName"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select
                  value={field.fieldType}
                  onChange={(e) => updateField(index, { fieldType: e.target.value as FieldType })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="TEXT">Short text</option>
                  <option value="TEXTAREA">Paragraph</option>
                  <option value="RADIO">Multiple choice</option>
                  <option value="SELECT">Dropdown</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Placeholder</label>
                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(index, { placeholder: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter text..."
                />
              </div>
            </div>

            {/* Options for Multiple Choice and Dropdown */}
            {(field.fieldType === 'RADIO' || field.fieldType === 'SELECT') && (
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Options (one per line)
                </label>
                <textarea
                  value={field.options?.join('\n') || ''}
                  onChange={(e) => updateField(index, {
                    options: e.target.value.split('\n')
                  })}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            )}

            <div className="flex justify-between items-center mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(index, { required: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">Required field</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => insertFieldBelow(index)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-teal-600 hover:text-teal-700 font-medium"
                >
                  <Plus size={12} />
                  Insert below
                </button>
                {canRemove && (
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConferenceCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    formInstructions: '',
    logoUrl: '',
    primaryColor: '#0d9488',
  });
  const [formFields, setFormFields] = useState<Partial<FormField>[]>([
    { fieldName: 'firstName', label: 'First Name', fieldType: 'TEXT', required: true, order: 0 },
    { fieldName: 'lastName', label: 'Last Name', fieldType: 'TEXT', required: true, order: 1 },
    { fieldName: 'email', label: 'Email', fieldType: 'EMAIL', required: true, order: 2 },
    { fieldName: 'company', label: 'Company', fieldType: 'TEXT', required: false, order: 3 },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty fields (fields without label or fieldName)
      const validFields = formFields.filter(
        field => field.label && field.label.trim() !== '' &&
                 field.fieldName && field.fieldName.trim() !== ''
      );

      if (validFields.length === 0) {
        alert('Please add at least one complete field');
        setLoading(false);
        return;
      }

      const conference = await api.createConference({
        ...formData,
        formFields: validFields.map((field, index) => ({
          ...field,
          order: index,
          // Clean up options array - filter out empty strings
          options: field.options?.filter(opt => opt.trim() !== '') || field.options,
        })),
      });
      navigate(`/conferences/${conference.id}`);
    } catch (error) {
      console.error('Error creating conference:', error);
      alert('Failed to create conference');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFormFields((items) => {
        const oldIndex = items.findIndex((_, i) => `field-${i}` === active.id);
        const newIndex = items.findIndex((_, i) => `field-${i}` === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], ...updates };
    setFormFields(newFields);
  };

  const addFieldAtEnd = () => {
    const fieldNumber = formFields.length + 1;
    setFormFields([
      ...formFields,
      {
        fieldName: `field${fieldNumber}`,
        label: `Field ${fieldNumber}`,
        fieldType: 'TEXT',
        required: false,
        order: formFields.length,
      },
    ]);
  };

  const insertFieldBelow = (index: number) => {
    const fieldNumber = formFields.length + 1;
    const newField: Partial<FormField> = {
      fieldName: `field${fieldNumber}`,
      label: `Field ${fieldNumber}`,
      fieldType: 'TEXT',
      required: false,
      order: index + 1,
    };
    const newFields = [...formFields];
    newFields.splice(index + 1, 0, newField);
    setFormFields(newFields);
  };

  const removeField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    if (currentStep === 1) return formData.name && formData.slug;
    if (currentStep === 2) return true;
    if (currentStep === 3) return formFields.length > 0 && formFields.every(f => f.label && f.fieldName);
    return false;
  };

  const nextStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('nextStep called, currentStep:', currentStep);
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      console.log('Moving to step:', currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Your Event</h1>
          <p className="text-lg text-gray-600">Set up your event registration in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 ${
                    currentStep > step
                      ? 'bg-green-500 text-white'
                      : currentStep === step
                      ? 'bg-teal-600 text-white scale-110 shadow-lg'
                      : 'bg-white text-gray-400 border-2 border-gray-300'
                  }`}>
                    {currentStep > step ? <Check size={24} /> : step}
                  </div>
                  <div className={`mt-2 text-sm font-medium ${currentStep >= step ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step === 1 ? 'Basic Info' : step === 2 ? 'Branding' : 'Form Fields'}
                  </div>
                </div>
                {step < 3 && (
                  <div className={`h-1 flex-1 mx-4 rounded transition-all duration-300 ${
                    currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} onKeyDown={(e) => {
            // Prevent Enter key from submitting form unless on final step
            if (e.key === 'Enter' && currentStep < 3) {
              const target = e.target as HTMLElement;
              // Only allow Enter in textareas for line breaks
              if (target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                e.stopPropagation();
                console.log('Enter key prevented, currentStep:', currentStep);
              }
            }
          }}>
            <div className="p-6 md:p-8">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                        setFormData({ ...formData, name, slug });
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Tech Summit 2024"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Slug
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500">
                      <span className="px-3 py-2 bg-gray-50 text-gray-600 border-r border-gray-300 text-sm">/form/</span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        className="flex-1 px-3 py-2 text-sm focus:outline-none"
                        placeholder="tech-summit-2024"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Your event will be available at: <span className="font-mono text-teal-600">/form/{formData.slug || 'your-slug'}</span></p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                      rows={3}
                      placeholder="Brief description of your event..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Form Instructions <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={formData.formInstructions}
                      onChange={(e) => setFormData({ ...formData, formInstructions: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                      rows={2}
                      placeholder="Add instructions or information for people filling out your form..."
                    />
                    <p className="mt-1 text-xs text-gray-500">This text will appear before the form fields to guide respondents.</p>
                  </div>
                </div>
              )}

              {/* Step 2: Branding */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="https://example.com/logo.png"
                    />
                    {formData.logoUrl && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">Logo Preview:</p>
                        <img
                          src={formData.logoUrl}
                          alt="Logo"
                          className="h-16 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<p class="text-xs text-red-600">Failed to load image</p>');
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="h-12 w-12 rounded-xl cursor-pointer border-2 border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
                        placeholder="#0d9488"
                      />
                    </div>
                    <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">Color Preview:</p>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl text-white text-sm font-medium shadow-lg transform hover:scale-105 transition-transform"
                        style={{ backgroundColor: formData.primaryColor }}
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Form Fields */}
              {currentStep === 3 && (
                <div className="animate-fadeIn">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Registration Fields</h2>
                    <button
                      type="button"
                      onClick={addFieldAtEnd}
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium"
                    >
                      + Add Field
                    </button>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={formFields.map((_, i) => `field-${i}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {formFields.map((field, index) => (
                          <SortableFieldItem
                            key={`field-${index}`}
                            field={field}
                            index={index}
                            updateField={updateField}
                            removeField={removeField}
                            insertFieldBelow={insertFieldBelow}
                            canRemove={formFields.length > 1}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2 transition-all transform hover:scale-105 disabled:transform-none"
                >
                  Continue <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !canProceed()}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2 transition-all transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? 'Creating...' : 'Create Event'} <Check size={20} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
