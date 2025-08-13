import React, { useState, useEffect } from 'react';
import { Task, TaskTemplate } from '../../../types/fhir';
import { FHIRUtils } from '../../../utils/fhirUtils';
import { FormField } from '../../common/FormField';
import { Button } from '../../common/Button';
import './TaskTemplateForm.css';

interface TaskTemplateFormProps {
  template?: TaskTemplate;
  onSave: (template: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const TaskTemplateForm: React.FC<TaskTemplateFormProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fhirTask, setFhirTask] = useState<Task>(() => 
    template?.fhirTask || FHIRUtils.createDefaultTask()
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setFhirTask(template.fhirTask);
    }
  }, [template]);

  const handleFhirFieldChange = (field: keyof Task, value: any) => {
    setFhirTask(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCodeableConceptChange = (field: keyof Task, text: string) => {
    setFhirTask(prev => ({
      ...prev,
      [field]: FHIRUtils.createCodeableConceptFromText(text),
    }));
  };

  const handleReferenceChange = (field: keyof Task, reference: string, display: string) => {
    setFhirTask(prev => ({
      ...prev,
      [field]: {
        reference,
        display,
      },
    }));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Template name is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Template description is required';
    }

    const fhirValidation = FHIRUtils.validateTask(fhirTask);
    if (!fhirValidation.isValid) {
      newErrors.fhir = fhirValidation.errors.join(', ');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        name,
        description,
        fhirTask,
      });
    }
  };

  return (
    <div className="task-template-form">
      <div className="task-template-form__header">
        <h2>{template ? 'Edit Task Template' : 'Create Task Template'}</h2>
        <p className="task-template-form__subtitle">
          Create reusable task templates based on HL7 FHIR Task resources
        </p>
      </div>

      <form onSubmit={handleSubmit} className="task-template-form__form">
        <div className="task-template-form__section">
          <h3>Template Information</h3>
          
          <FormField
            label="Template Name"
            required
            error={errors.name}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name..."
            />
          </FormField>

          <FormField
            label="Template Description"
            required
            error={errors.description}
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this task template..."
              rows={3}
            />
          </FormField>
        </div>

        <div className="task-template-form__section">
          <h3>FHIR Task Details</h3>
          
          <div className="task-template-form__row">
            <FormField
              label="Status"
              required
              description="Current state of the task"
            >
              <select
                value={fhirTask.status}
                onChange={(e) => handleFhirFieldChange('status', e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="requested">Requested</option>
                <option value="received">Received</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="ready">Ready</option>
                <option value="cancelled">Cancelled</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="failed">Failed</option>
                <option value="completed">Completed</option>
                <option value="entered-in-error">Entered in Error</option>
              </select>
            </FormField>

            <FormField
              label="Intent"
              required
              description="Indicates the level of authority/intentionality"
            >
              <select
                value={fhirTask.intent}
                onChange={(e) => handleFhirFieldChange('intent', e.target.value)}
              >
                <option value="unknown">Unknown</option>
                <option value="proposal">Proposal</option>
                <option value="plan">Plan</option>
                <option value="order">Order</option>
                <option value="original-order">Original Order</option>
                <option value="reflex-order">Reflex Order</option>
                <option value="filler-order">Filler Order</option>
                <option value="instance-order">Instance Order</option>
                <option value="option">Option</option>
              </select>
            </FormField>
          </div>

          <FormField
            label="Priority"
            description="Indicates how quickly the task should be addressed"
          >
            <select
              value={fhirTask.priority || ''}
              onChange={(e) => handleFhirFieldChange('priority', e.target.value || undefined)}
            >
              <option value="">Not specified</option>
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
              <option value="asap">ASAP</option>
              <option value="stat">STAT</option>
            </select>
          </FormField>

          <FormField
            label="Task Code"
            description="A name or code for the task"
          >
            <input
              type="text"
              value={fhirTask.code?.text || ''}
              onChange={(e) => e.target.value ? 
                handleCodeableConceptChange('code', e.target.value) : 
                setFhirTask(prev => ({ ...prev, code: undefined }))
              }
              placeholder="Task code or name..."
            />
          </FormField>

          <FormField
            label="Description"
            description="Human-readable explanation of task"
          >
            <textarea
              value={fhirTask.description || ''}
              onChange={(e) => handleFhirFieldChange('description', e.target.value)}
              placeholder="Describe the task..."
              rows={3}
            />
          </FormField>

          <div className="task-template-form__row">
            <FormField
              label="For (Patient/Subject)"
              description="Beneficiary of the task"
            >
              <input
                type="text"
                value={fhirTask.for?.reference || ''}
                onChange={(e) => handleReferenceChange('for', e.target.value, fhirTask.for?.display || '')}
                placeholder="Patient/123"
              />
            </FormField>

            <FormField
              label="Subject Display Name"
              description="Human-readable name"
            >
              <input
                type="text"
                value={fhirTask.for?.display || ''}
                onChange={(e) => handleReferenceChange('for', fhirTask.for?.reference || '', e.target.value)}
                placeholder="Patient name"
              />
            </FormField>
          </div>

          <div className="task-template-form__row">
            <FormField
              label="Focus Reference"
              description="What task is acting on"
            >
              <input
                type="text"
                value={fhirTask.focus?.reference || ''}
                onChange={(e) => e.target.value ? 
                  setFhirTask(prev => ({ ...prev, focus: { reference: e.target.value, display: fhirTask.focus?.display || '' } })) :
                  setFhirTask(prev => ({ ...prev, focus: undefined }))
                }
                placeholder="ServiceRequest/123, Goal/456, etc."
              />
            </FormField>

            <FormField
              label="Focus Display"
              description="Human-readable description"
            >
              <input
                type="text"
                value={fhirTask.focus?.display || ''}
                onChange={(e) => fhirTask.focus ?
                  setFhirTask(prev => ({ ...prev, focus: { ...prev.focus!, display: e.target.value } })) : null
                }
                placeholder="Focus description"
              />
            </FormField>
          </div>

          <div className="task-template-form__row">
            <FormField
              label="Authored On"
              description="Task creation date"
            >
              <input
                type="datetime-local"
                value={fhirTask.authoredOn ? fhirTask.authoredOn.replace('Z', '') : ''}
                onChange={(e) => handleFhirFieldChange('authoredOn', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              />
            </FormField>

            <FormField
              label="Last Modified"
              description="Most recent change date"
            >
              <input
                type="datetime-local"
                value={fhirTask.lastModified ? fhirTask.lastModified.replace('Z', '') : ''}
                onChange={(e) => handleFhirFieldChange('lastModified', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              />
            </FormField>
          </div>

          <FormField
            label="Business Status"
            description="Human-readable status information"
          >
            <input
              type="text"
              value={fhirTask.businessStatus?.text || ''}
              onChange={(e) => e.target.value ? 
                handleCodeableConceptChange('businessStatus', e.target.value) : 
                setFhirTask(prev => ({ ...prev, businessStatus: undefined }))
              }
              placeholder="E.g., 'Waiting for physician review'"
            />
          </FormField>
        </div>

        {errors.fhir && (
          <div className="task-template-form__error">
            FHIR validation errors: {errors.fhir}
          </div>
        )}

        <div className="task-template-form__actions">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {template ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </form>
    </div>
  );
};