exports.handler = async function(event) {
  const SERP_KEY = '60d34da0e21307ce726fd9ec4cade0d738852ea37f79329d09a98f0e43f2f9a4';
  const q = event.queryStringParameters?.q || 'car accident crash fatal';

  try {
    const url = `https://serpapi.com/search.json?engine=google_news&q=${encodeURIComponent(q)}&api_key=${SERP_KEY}&num=20`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('SerpApi error ' + res.status);
    const data = await res.json();

    const articles = (data.news_results || []).map(item => ({
      title:       item.title || '',
      link:        item.link || '#',
      description: item.snippet || item.title || '',
      pubDate:     item.date || '',
      source:      item.source?.name || item.source || '',
      image:       item.thumbnail || item.source?.icon || ''
    })).filter(i => i.title);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ articles })
    };
  } catch(err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message, articles: [] })
    };
  }
};
