// API call: fetch() loads a short quote from the internet.
// If the first API is down, the next one is tried (backup).
export type CoffeeTip = { title: string; description: string };

async function getJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000); // wait at most 6 seconds
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

const sources: (() => Promise<CoffeeTip>)[] = [
  async () => {
    const d = await getJson<{ quote: string; author: string }>('https://dummyjson.com/quotes/random');
    return { title: d.author, description: d.quote };
  },
  async () => {
    const d = await getJson<{ slip: { advice: string } }>('https://api.adviceslip.com/advice');
    return { title: 'Daily advice', description: d.slip.advice };
  },
  async () => {
    const id = Math.floor(Math.random() * 100) + 1;
    const d = await getJson<{ title: string; body: string }>(`https://jsonplaceholder.typicode.com/posts/${id}`);
    return { title: d.title, description: d.body.replace(/\n/g, ' ') };
  },
];

export async function getCoffeeTip(): Promise<CoffeeTip> {
  let lastError: unknown;
  for (const load of sources) {
    try {
      return await load();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}
