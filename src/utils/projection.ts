export type Inputs = {
  rate: number;
  hours: number;
  retainer: number;
  productPrice: number;
  units: number;
   email: string; 
};
export type Projection = {
  monthly: number[];
  annual: number;
};

export function calculateProjection({
  rate,
  hours,
  retainer,
  productPrice,
  units
}: Inputs): Projection {
  const months = Array.from({ length: 12 }, (_, i) => {
    const consulting = rate * hours * 4.3 * (1 + i * 0.05);
    const product = productPrice * units * (1 - i * 0.02);
    const retainerFluctuation = retainer * (0.95 + Math.random() * 0.1); // ±5%

    return Math.round(consulting + retainerFluctuation + Math.max(product, 0)); // не < 0
  });

  const annual = months.reduce((a, b) => a + b, 0);

  return { monthly: months, annual };
}