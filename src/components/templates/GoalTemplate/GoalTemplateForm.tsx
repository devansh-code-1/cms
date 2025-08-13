import React, { useState, useEffect } from 'react';
import { Goal, GoalTemplate } from '../../../types/fhir';
import { FHIRUtils } from '../../../utils/fhirUtils';
import { FormField } from '../../common/FormField';
import { Button } from '../../common/Button';
import './GoalTemplateForm.css';

interface GoalTemplateFormProps {
  template?: GoalTemplate;
  onSave: (template: Omit<GoalTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const GoalTemplateForm: React.FC<GoalTemplateFormProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fhirGoal, setFhirGoal] = useState<Goal>(() => 
    template?.fhirGoal || FHIRUtils.createDefaultGoal()
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setFhirGoal(template.fhirGoal);
    }
  }, [template]);

  const handleFhirFieldChange = (field: keyof Goal, value: any) => {
    setFhirGoal(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCodeableConceptChange = (field: keyof Goal, text: string) => {
    setFhirGoal(prev => ({
      ...prev,
      [field]: FHIRUtils.createCodeableConceptFromText(text),
    }));
  };

  const handleSubjectChange = (reference: string, display: string) => {
    setFhirGoal(prev => ({
      ...prev,
      subject: {
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

    const fhirValidation = FHIRUtils.validateGoal(fhirGoal);
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
        fhirGoal,
      });
    }
  };

  return (
    <div className="goal-template-form">
      <div className="goal-template-form__header">
        <h2>{template ? 'Edit Goal Template' : 'Create Goal Template'}</h2>
        <p className="goal-template-form__subtitle">
          Create reusable goal templates based on HL7 FHIR Goal resources
        </p>
      </div>

      <form onSubmit={handleSubmit} className="goal-template-form__form">
        <div className="goal-template-form__section">
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
              placeholder="Describe this goal template..."
              rows={3}
            />
          </FormField>
        </div>

        <div className="goal-template-form__section">
          <h3>FHIR Goal Details</h3>
          
          <FormField
            label="Lifecycle Status"
            required
            description="Current state of the goal"
          >
            <select
              value={fhirGoal.lifecycleStatus}
              onChange={(e) => handleFhirFieldChange('lifecycleStatus', e.target.value)}
            >
              <option value="proposed">Proposed</option>
              <option value="planned">Planned</option>
              <option value="accepted">Accepted</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="entered-in-error">Entered in Error</option>
              <option value="rejected">Rejected</option>
            </select>
          </FormField>

          <FormField
            label="Goal Description"
            required
            description="Human-readable description of the goal"
          >
            <textarea
              value={fhirGoal.description.text || ''}
              onChange={(e) => handleCodeableConceptChange('description', e.target.value)}
              placeholder="Describe the goal..."
              rows={3}
            />
          </FormField>

          <FormField
            label="Priority"
            description="Indicates the importance of achieving the goal"
          >
            <select
              value={fhirGoal.priority?.text || ''}
              onChange={(e) => e.target.value ? 
                handleCodeableConceptChange('priority', e.target.value) : 
                setFhirGoal(prev => ({ ...prev, priority: undefined }))
              }
            >
              <option value="">Not specified</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </FormField>

          <div className="goal-template-form__row">
            <FormField
              label="Subject Reference"
              required
              description="Reference to the patient or group"
            >
              <input
                type="text"
                value={fhirGoal.subject.reference || ''}
                onChange={(e) => handleSubjectChange(e.target.value, fhirGoal.subject.display || '')}
                placeholder="Patient/123 or Group/456"
              />
            </FormField>

            <FormField
              label="Subject Display"
              description="Human-readable name for the subject"
            >
              <input
                type="text"
                value={fhirGoal.subject.display || ''}
                onChange={(e) => handleSubjectChange(fhirGoal.subject.reference || '', e.target.value)}
                placeholder="Patient name or group name"
              />
            </FormField>
          </div>

          <div className="goal-template-form__row">
            <FormField
              label="Start Date"
              description="When goal pursuit begins"
            >
              <input
                type="date"
                value={fhirGoal.startDate || ''}
                onChange={(e) => handleFhirFieldChange('startDate', e.target.value)}
              />
            </FormField>

            <FormField
              label="Status Date"
              description="When goal status took effect"
            >
              <input
                type="date"
                value={fhirGoal.statusDate || ''}
                onChange={(e) => handleFhirFieldChange('statusDate', e.target.value)}
              />
            </FormField>
          </div>

          <FormField
            label="Status Reason"
            description="Reason for current status"
          >
            <input
              type="text"
              value={fhirGoal.statusReason || ''}
              onChange={(e) => handleFhirFieldChange('statusReason', e.target.value)}
              placeholder="Reason for the current status..."
            />
          </FormField>
        </div>

        {errors.fhir && (
          <div className="goal-template-form__error">
            FHIR validation errors: {errors.fhir}
          </div>
        )}

        <div className="goal-template-form__actions">
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