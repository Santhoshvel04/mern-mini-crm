function idOf(doc) {
  if (!doc) return null;
  if (typeof doc === 'string') return doc;
  if (doc._id) return doc._id.toString();
  return doc.toString();
}

function user(u) {
  if (!u) return null;
  return { id: idOf(u), name: u.name, email: u.email };
}

function company(c) {
  if (!c) return null;
  return {
    id: idOf(c),
    name: c.name,
    industry: c.industry,
    location: c.location,
  };
}

function lead(l) {
  if (!l) return null;
  const assigned = l.assignedTo && l.assignedTo.name ? user(l.assignedTo) : null;
  const comp = l.company && l.company.name ? company(l.company) : null;
  return {
    id: idOf(l),
    name: l.name,
    email: l.email,
    phone: l.phone || '',
    status: l.status,
    assignedTo: assigned || (l.assignedTo ? { id: idOf(l.assignedTo) } : null),
    company: comp || (l.company ? { id: idOf(l.company) } : null),
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  };
}

function task(t) {
  if (!t) return null;
  const assigned = t.assignedTo && t.assignedTo.name ? user(t.assignedTo) : null;
  const leadDoc = t.lead && t.lead.name ? lead(t.lead) : null;
  return {
    id: idOf(t),
    title: t.title,
    dueDate: t.dueDate,
    status: t.status,
    assignedTo: assigned || (t.assignedTo ? { id: idOf(t.assignedTo) } : null),
    lead: leadDoc || (t.lead ? { id: idOf(t.lead) } : null),
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

module.exports = { idOf, user, company, lead, task };
