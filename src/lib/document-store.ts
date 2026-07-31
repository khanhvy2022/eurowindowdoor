// In-memory store for uploaded PDF content
// This allows the chat to work without needing Supabase tables for document storage

const uploadedDocuments = new Map<string, { fileName: string; content: string; uploadedAt: Date }>();

export function storeDocument(id: string, fileName: string, content: string) {
  uploadedDocuments.set(id, { fileName, content, uploadedAt: new Date() });
  
  // Auto-cleanup after 1 hour to prevent memory leaks
  setTimeout(() => {
    uploadedDocuments.delete(id);
  }, 60 * 60 * 1000);
}

export function getDocument(id: string) {
  return uploadedDocuments.get(id) || null;
}

export function getLatestDocument() {
  let latest: { id: string; fileName: string; content: string; uploadedAt: Date } | null = null;
  
  for (const [id, doc] of uploadedDocuments.entries()) {
    if (!latest || doc.uploadedAt > latest.uploadedAt) {
      latest = { id, ...doc };
    }
  }
  
  return latest;
}
