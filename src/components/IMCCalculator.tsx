import { Scale } from 'lucide-react';
import { useId, useRef, useState, type FormEvent } from 'react';
import type { HeightUnit, IMCInput, Sex } from '../types/imc';
import { parseDecimal, validateIMCForm, type IMCFormErrors } from '../utils/imc';

interface IMCCalculatorProps {
  onCalculate: (input: IMCInput) => void;
}

type FieldName = keyof IMCFormErrors;

export function IMCCalculator({ onCalculate }: IMCCalculatorProps) {
  const id = useId();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex>('nao_informado');
  const [errors, setErrors] = useState<IMCFormErrors>({});

  const refs = {
    weight: useRef<HTMLInputElement>(null),
    height: useRef<HTMLInputElement>(null),
    age: useRef<HTMLInputElement>(null),
  };

  const fieldId = (name: string) => `${id}-${name}`;
  const errorId = (name: FieldName) => `${id}-${name}-error`;

  function clearError(name: FieldName) {
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function changeUnit(next: HeightUnit) {
    if (next === heightUnit) return;
    const value = parseDecimal(height);
    // Converte o que já foi digitado para a nova unidade.
    if (Number.isFinite(value) && value > 0) {
      const converted = next === 'm' ? value / 100 : value * 100;
      setHeight(String(Math.round(converted * 100) / 100));
    }
    setHeightUnit(next);
    clearError('height');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { errors: found, input } = validateIMCForm({ weight, height, heightUnit, age });

    // type="number" devolve "" para entradas que o navegador não entende.
    if (refs.weight.current?.validity.badInput) found.weight = 'Informe um peso válido, usando apenas números.';
    if (refs.height.current?.validity.badInput) found.height = 'Informe uma altura válida, usando apenas números.';
    if (refs.age.current?.validity.badInput) found.age = 'Informe a idade usando apenas números.';

    setErrors(found);
    const firstInvalid = (['weight', 'height', 'age'] as const).find((name) => found[name]);
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }
    if (input) onCalculate(input);
  }

  const fieldProps = (name: FieldName) => ({
    id: fieldId(name),
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? errorId(name) : `${fieldId(name)}-hint`,
  });

  const errorText = (name: FieldName) =>
    errors[name] ? (
      <p className="field__error" id={errorId(name)} role="alert">
        <span aria-hidden="true">⚠</span> {errors[name]}
      </p>
    ) : null;

  return (
    <section className="card calculator" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="card__title">
        Calcule seu IMC
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor={fieldId('weight')}>
            Peso
          </label>
          <div className="input-affix">
            <input
              ref={refs.weight}
              {...fieldProps('weight')}
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              placeholder="80,0"
              autoComplete="off"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                clearError('weight');
              }}
            />
            <span className="input-affix__unit" aria-hidden="true">
              kg
            </span>
          </div>
          <span id={`${fieldId('weight')}-hint`} className="sr-only">
            Em quilogramas
          </span>
          {errorText('weight')}
        </div>

        <div className="field">
          <div className="field__row">
            <label className="field__label" htmlFor={fieldId('height')}>
              Altura
            </label>
            <fieldset className="segmented">
              <legend className="sr-only">Unidade da altura</legend>
              {(['cm', 'm'] as const).map((unit) => (
                <label key={unit} className="segmented__option">
                  <input
                    type="radio"
                    name={`${id}-unit`}
                    value={unit}
                    checked={heightUnit === unit}
                    onChange={() => changeUnit(unit)}
                  />
                  <span>{unit === 'cm' ? 'Centímetros' : 'Metros'}</span>
                </label>
              ))}
            </fieldset>
          </div>
          <div className="input-affix">
            <input
              ref={refs.height}
              {...fieldProps('height')}
              type="number"
              inputMode="decimal"
              step={heightUnit === 'cm' ? '1' : '0.01'}
              min="0"
              placeholder={heightUnit === 'cm' ? '175' : '1,75'}
              autoComplete="off"
              value={height}
              onChange={(e) => {
                setHeight(e.target.value);
                clearError('height');
              }}
            />
            <span className="input-affix__unit" aria-hidden="true">
              {heightUnit}
            </span>
          </div>
          <span id={`${fieldId('height')}-hint`} className="sr-only">
            {heightUnit === 'cm' ? 'Em centímetros' : 'Em metros'}
          </span>
          {errorText('height')}
        </div>

        <details className="optional">
          <summary>Idade e sexo (opcional)</summary>
          <div className="optional__body">
            <div className="field">
              <label className="field__label" htmlFor={fieldId('age')}>
                Idade
              </label>
              <div className="input-affix input-affix--short">
                <input
                  ref={refs.age}
                  {...fieldProps('age')}
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="2"
                  max="130"
                  placeholder="34"
                  autoComplete="off"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    clearError('age');
                  }}
                />
                <span className="input-affix__unit" aria-hidden="true">
                  anos
                </span>
              </div>
              <span id={`${fieldId('age')}-hint`} className="field__hint">
                Para menores de 18 anos, a tabela de adultos não se aplica.
              </span>
              {errorText('age')}
            </div>

            <fieldset className="field radio-group">
              <legend className="field__label">Sexo</legend>
              {(
                [
                  ['feminino', 'Feminino'],
                  ['masculino', 'Masculino'],
                  ['nao_informado', 'Prefiro não informar'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="radio">
                  <input
                    type="radio"
                    name={`${id}-sex`}
                    value={value}
                    checked={sex === value}
                    onChange={() => setSex(value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
              <p className="field__hint">O sexo não altera a fórmula do IMC para adultos.</p>
            </fieldset>
          </div>
        </details>

        <button type="submit" className="button button--primary button--large">
          <Scale size={20} aria-hidden="true" />
          Calcular meu IMC
        </button>
      </form>
    </section>
  );
}
