module.exports = async (req, res) => {
  let u;
  try { u = new URL(String(req.query.url || '')); }
  catch { return res.status(400).send('URL non valido'); }

  const okHost = u.hostname === 'booking.com' || u.hostname.endsWith('.booking.com');
  if (u.protocol !== 'https:' || !okHost) return res.status(400).send('Sono ammessi solo link booking.com');

  try {
    const r = await fetch(u, { headers: { 'User-Agent': 'TraNeveELago/1.0' } });
    const t = await r.text();
    if (!r.ok || !t.includes('BEGIN:VCALENDAR')) return res.status(502).send('Calendario Booking non valido');
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(t);
  } catch (e) {
    res.status(502).send('Download non riuscito');
  }
};