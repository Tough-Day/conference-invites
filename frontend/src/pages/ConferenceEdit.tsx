import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertTriangle, GripVertical, Plus } from 'lucide-react';
import { api } from '../services/api';
import { Conference, FormField, FieldType } from '../types';
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
  hasTypeChanged: boolean;
  submissionCount: number;
  updateField: (index: number, updates: Partial<FormField>) => void;
  removeField: (index: number) => void;
  insertFieldBelow: (index: number) => void;
  canRemove: boolean;
}

function SortableFieldItem({
  field,
  index,
  hasTypeChanged,
  submissionCount,
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
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 mt-4 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <GripVertical size={20} />
          </div>

          {/* Field Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Field Name</label>
                <input
                  type="text"
                  value={field.fieldName}
                  onChange={(e) => updateField(index, { fieldName: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="firstName"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select
                  value={field.fieldType}
                  onChange={(e) => updateField(index, { fieldType: e.target.value as FieldType })}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    hasTypeChanged ? 'border-amber-400 bg-amber-50' : 'border-gray-300'
                  }`}
                >
                  <option value="TEXT">Short text</option>
                  <option value="TEXTAREA">Paragraph</option>
                  <option value="RADIO">Multiple choice</option>
                  <option value="SELECT">Dropdown</option>
                </select>
                {hasTypeChanged && submissionCount > 0 && (
                  <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Type changed - will create versioned field
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Placeholder</label>
                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(index, { placeholder: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
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
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">Required field</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => insertFieldBelow(index)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-teal-600 hover:text-teal-700 font-medium"
                >
                  <Plus size={14} />
                  Insert below
                </button>
                {canRemove && (
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
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

export default function ConferenceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [conference, setConference] = useState<Conference | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'fields'>('info');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    formInstructions: '',
    logoUrl: '',
    primaryColor: '#0d9488',
  });
  const [formFields, setFormFields] = useState<Partial<FormField>[]>([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [originalFieldTypes, setOriginalFieldTypes] = useState<Map<string, FieldType>>(new Map());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (id) {
      loadConference();
    }
  }, [id]);

  const loadConference = async () => {
    try {
      const data = await fetch(`/api/conferences/id/${id}`).then(r => r.json());
      setConference(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        formInstructions: data.formInstructions || '',
        logoUrl: data.logoUrl || '',
        primaryColor: data.primaryColor || '#0d9488',
      });

      // Store original field types for change detection
      const typeMap = new Map<string, FieldType>();
      data.formFields?.forEach((field: FormField) => {
        if (field.id) {
          typeMap.set(field.id, field.fieldType);
        }
      });
      setOriginalFieldTypes(typeMap);

      // Only show active fields in edit form
      const activeFields = data.formFields?.filter((f: FormField) => f.isActive !== false) || [];
      setFormFields(activeFields);

      // Set submission count
      setSubmissionCount(data._count?.submissions || 0);
    } catch (error) {
      console.error('Error loading conference:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Filter out empty fields (fields without label or fieldName)
      const validFields = formFields.filter(
        field => field.label && field.label.trim() !== '' &&
                 field.fieldName && field.fieldName.trim() !== ''
      );

      if (validFields.length === 0) {
        alert('Please add at least one complete field');
        setSaving(false);
        return;
      }

      await api.updateConference(id!, {
        ...formData,
        formFields: validFields.map((field, index) => ({
          ...field,
          order: index,
          // Clean up options array - filter out empty strings
          options: field.options?.filter(opt => opt.trim() !== '') || field.options,
        })),
      });
      navigate(`/conferences/${id}`);
    } catch (error) {
      console.error('Error updating conference:', error);
      alert('Failed to update event');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!conference) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/conferences/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={18} />
          Back to Event
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Event</h1>
              <p className="text-sm text-gray-600">Update your event details and settings</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'info'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Event Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('fields')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'fields'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Form Fields
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Info Tab */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Slug
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <span className="px-3 py-2 text-sm text-gray-600 border-r border-gray-300">/form/</span>
                      <span className="px-3 py-2 text-sm text-gray-500">{conference.slug}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">URL slug cannot be changed after creation</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Form Instructions <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={formData.formInstructions}
                      onChange={(e) => setFormData({ ...formData, formInstructions: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Add instructions or information for people filling out your form..."
                    />
                    <p className="mt-1 text-xs text-gray-500">This text will appear before the form fields to guide respondents.</p>
                  </div>

                  {/* Branding */}
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Branding</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Logo URL <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                          type="url"
                          value={formData.logoUrl}
                          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="https://example.com/logo.png"
                        />
                        {formData.logoUrl && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
                            <img
                              src={formData.logoUrl}
                              alt="Logo"
                              className="h-16 object-contain"
                              onError={(e) => e.currentTarget.style.display = 'none'}
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
                            className="h-10 w-10 rounded-lg cursor-pointer border-2 border-gray-300"
                          />
                          <input
                            type="text"
                            value={formData.primaryColor}
                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
                            placeholder="#0d9488"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields Tab */}
              {activeTab === 'fields' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900">Form Fields</h3>
                    <button
                      type="button"
                      onClick={addFieldAtEnd}
                      className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      + Add Field
                    </button>
                  </div>

                  {/* Warning for forms with submissions */}
                  {submissionCount > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-amber-900">
                          This form has {submissionCount} submission{submissionCount !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          Changing field types will create versioned fields to preserve existing data.
                        </p>
                      </div>
                    </div>
                  )}

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
                        {formFields.map((field, index) => {
                          const hasTypeChanged = field.id && originalFieldTypes.has(field.id) &&
                                                originalFieldTypes.get(field.id) !== field.fieldType;
                          return (
                            <SortableFieldItem
                              key={`field-${index}`}
                              field={field}
                              index={index}
                              hasTypeChanged={hasTypeChanged}
                              submissionCount={submissionCount}
                              updateField={updateField}
                              removeField={removeField}
                              insertFieldBelow={insertFieldBelow}
                              canRemove={formFields.length > 1}
                            />
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(`/conferences/${id}`)}
                  className="px-4 py-2 text-sm text-gray-700 font-medium hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
