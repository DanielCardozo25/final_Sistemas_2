import Ticket from '../models/Ticket.js';

export async function generarPDF(req, res) {
  const apiKey = process.env.PDFMONKEY_API_KEY;
  const templateId = process.env.PDFMONKEY_TEMPLATE_ID;
  if (!apiKey || !templateId) {
    return res.status(500).json({ mensaje: 'PDFMonkey no configurado' });
  }
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ mensaje: 'Ticket no encontrado' });

    const payload = {
      document: {
        document_template_id: templateId,
        payload: {
          nroTicket: ticket.nroTicket,
          clienteNombre: ticket.clienteNombre,
          fecha: ticket.fecha,
          hora: ticket.hora,
          formaPago: ticket.formaPago,
          totalArticulos: ticket.totalArticulos,
          total: ticket.total,
          items: ticket.items
        },
        status: 'pending'
      }
    };

    const createRes = await fetch('https://api.pdfmonkey.io/api/v1/documents', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const createData = await createRes.json();
    const docId = createData?.document?.id;
    if (!docId) return res.status(500).json({ mensaje: 'Error al crear documento', detail: createData });

    let downloadUrl = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 1500));
      const getRes = await fetch(`https://api.pdfmonkey.io/api/v1/documents/${docId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      const getData = await getRes.json();
      const doc = getData?.document;
      if (doc?.status === 'success') { downloadUrl = doc.download_url; break; }
      if (doc?.status === 'failure') { return res.status(500).json({ mensaje: 'Fallo al generar PDF', detail: getData }); }
    }

    if (!downloadUrl) return res.status(504).json({ mensaje: 'Timeout generando PDF' });
    res.json({ downloadUrl });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al generar PDF', error: error.message });
  }
}
