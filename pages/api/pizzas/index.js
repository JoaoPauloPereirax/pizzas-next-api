import { pizzas } from '../../../db.json';

const errorRating = process.env.ERROR_RATING || 0;
const errorPercentage = errorRating * 100;

const shouldThrowError = () => Math.round(Math.random() * 100) < errorPercentage;

const serializePizzas = (pizzas, baseUrl) =>
  pizzas.reduce(
    (accumulator, pizza) => [
      ...accumulator,
      {
        ...pizza,
        image: `${baseUrl}/images/${pizza.image}`,
      },
    ],
    []
  );

export default (req, res) => {
  if (shouldThrowError()) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  const isHttps = Boolean(req.connection.encrypted);
  const { host } = req.headers;

  const baseUrl = isHttps ? `https://${host}` : `http://${host}`;

  const serializedPizzas = serializePizzas(pizzas, baseUrl);

  return res.status(200).json({ pizzas: serializedPizzas });
};
