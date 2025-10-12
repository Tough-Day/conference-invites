import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';
import { Conference } from '../types';

export default function PublicForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const loadAndTrack = async () => {
      if (!slug) return;

      try {
        const data = await api.getConference(slug);
        setConference(data);

        // Track page view only once using ref (persists across React Strict Mode double-renders)
        if (!hasTrackedRef.current) {
          hasTrackedRef.current = true;
          await api.trackEvent(data.id, 'PAGE_VIEW');
        }
      } catch (error) {
        console.error('Error loading conference:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAndTrack();
  }, [slug]);

  const onSubmit = async (data: any) => {
    if (!conference) return;

    setSubmitting(true);
    try {
      await api.createSubmission({
        conferenceId: conference.id,
        formData: data,
      });
      navigate('/success');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!conference.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Closed</h1>
          <p className="text-gray-600">This event is no longer accepting submissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        backgroundColor: conference.primaryColor ? `${conference.primaryColor}10` : '#f9fafb',
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header with Both Logos */}
          <div className="text-center mb-8">
            {/* Logos Row */}
            <div className="flex items-center justify-center gap-8 mb-6">
              {/* Toughday Logo */}
              <img
                src="/assets/toughday-logo.png"
                alt="Toughday"
                className="h-16 object-contain"
                onError={(e) => {
                  // Fallback to text if logo not found
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"%3E%3Ctext x="10" y="40" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="%23334155"%3EToughday%3C/text%3E%3C/svg%3E';
                }}
              />

              {/* Event Logo (if provided) */}
              {conference.logoUrl && (
                <>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <img
                    src={conference.logoUrl}
                    alt={conference.name}
                    className="h-16 object-contain"
                  />
                </>
              )}
            </div>

            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: conference.primaryColor || '#111827' }}
            >
              {conference.name}
            </h1>
            {conference.description && (
              <p className="text-gray-600">{conference.description}</p>
            )}
          </div>

          {/* Form Instructions */}
          {conference.formInstructions && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{conference.formInstructions}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {conference.formFields
              .filter((field) => field.isActive === undefined || field.isActive === true) // Only show active fields in public form
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.fieldType === 'TEXTAREA' ? (
                    <textarea
                      {...register(field.fieldName, { required: field.required })}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : field.fieldType === 'SELECT' ? (
                    <select
                      {...register(field.fieldName, { required: field.required })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select an option...</option>
                      {field.options?.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.fieldType === 'RADIO' ? (
                    <div className="space-y-2">
                      {field.options?.map((option, i) => (
                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            {...register(field.fieldName, { required: field.required })}
                            value={option}
                            className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      {...register(field.fieldName, { required: field.required })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}

                  {errors[field.fieldName] && (
                    <p className="text-red-500 text-sm mt-1">
                      {field.required ? 'This field is required' : 'Invalid input'}
                    </p>
                  )}
                </div>
              ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-6 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                backgroundColor: conference.primaryColor || '#3B82F6',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
