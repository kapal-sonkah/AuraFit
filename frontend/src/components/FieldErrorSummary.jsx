import { forwardRef } from 'react';

function toKebabCase(value) {
  return value.replace(/([a-z])([A-Z])/g, '$1-$2').replaceAll('_', '-').toLowerCase();
}

const FieldErrorSummary = forwardRef(function FieldErrorSummary({ errors, prefix, getFieldId, title = 'Periksa isian yang ditandai.' }, ref) {
  const entries = Object.entries(errors || {});
  if (!entries.length) return null;

  function focusField(name) {
    const fieldId = getFieldId ? getFieldId(name) : `${prefix}-${toKebabCase(name)}`;
    document.getElementById(fieldId)?.focus();
  }

  return (
    <div ref={ref} className="field-error-summary" role="alert" tabIndex="-1" aria-labelledby={`${prefix}-error-summary-title`}>
      <p id={`${prefix}-error-summary-title`} className="field-error-summary__title">{title}</p>
      <ul className="field-error-summary__list">
        {entries.map(([name, message]) => (
          <li key={name}>
            <button type="button" className="field-error-summary__link" onClick={() => focusField(name)}>
              {message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default FieldErrorSummary;
