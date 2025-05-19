import { useForm } from 'react-hook-form';
import { Inputs } from '../utils/projection';
import styles from '../styles/RateForm.module.css'; 

type Props = { onSubmit: (data: Inputs) => void };

export default function RateForm({ onSubmit }: Props) {
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: { rate: 100, hours: 10, retainer: 5, productPrice: 5, units: 5,email:'andrewkiev500@gmail.com' }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.heading}>Income Inputs</h2>

      <div className={styles.grid}>
        <label className={styles.label}>
          Hourly Rate (USD)
          <input  type="number" {...register('rate', { valueAsNumber: true })} className={styles.input} />
        </label>

        <label className={styles.label}>
          Weekly Hours
          <input  type="number" {...register('hours', { valueAsNumber: true })} className={styles.input} />
        </label>

        <label className={styles.label}>
          Monthly Retainer
          <input  type="number" {...register('retainer', { valueAsNumber: true })} className={styles.input} />
        </label>

        <label className={styles.label}>
          Product Price
          <input  type="number" {...register('productPrice', { valueAsNumber: true })} className={styles.input} />
        </label>

        <label className={styles.label}>
          Units / Month
          <input  type="number" {...register('units', { valueAsNumber: true })} className={styles.input} />
        </label>

        <label className={styles.label}>
  Email
  <input
    type="email"
    {...register('email')}
    className={styles.input}
    required
  />
</label>
      </div>

      <div className={styles.buttonWrapper}>
        <button type="submit" className={styles.button}>
          Calculate
        </button>
      </div>
    </form>
  );
}
