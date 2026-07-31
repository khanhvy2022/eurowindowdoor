/**
 * Client-side utility for extracting text from PDF files using pdfjs-dist.
 * Bypasses server payload limits and offloads CPU parsing to the browser.
 */
export const extractTextFromPDFClient = async (file: File): Promise<string> => {
  let pdfjsLib: any = null;
  let loaded = false;
  let lastError: any = null;

  // List of CDNs to try loading PDF.js from
  const cdns = [
    {
      url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs',
      worker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs'
    },
    {
      url: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs',
      worker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs'
    },
    {
      url: 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.min.mjs',
      worker: 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs'
    }
  ];

  for (const cdn of cdns) {
    try {
      // Use new Function to import dynamically to bypass Webpack build-time bundling/checking
      const importFn = new Function('url', 'return import(url)');
      pdfjsLib = await importFn(cdn.url);

      // Fetch the worker code and build a Blob URL to bypass browser cross-origin Web Worker restrictions (CORS)
      const workerResponse = await fetch(cdn.worker);
      if (!workerResponse.ok) {
        throw new Error(`Failed to fetch worker: ${workerResponse.statusText}`);
      }
      const workerCode = await workerResponse.text();
      const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
      pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob);

      loaded = true;
      console.log(`Successfully loaded PDF.js from ${cdn.url}`);
      break;
    } catch (err) {
      console.warn(`Failed to load PDF.js from ${cdn.url}:`, err);
      lastError = err;
    }
  }

  // Fallback to local import if CDNs are blocked or unavailable
  if (!loaded) {
    try {
      // @ts-ignore
      pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      console.log('Successfully loaded PDF.js from local package');
    } catch (err) {
      console.error('All PDF.js loading methods failed:', err);
      throw new Error(`Không thể khởi tạo thư viện đọc PDF: ${lastError?.message || (err as Error).message}`);
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    text += pageText + '\n\n';
  }
  return text.trim();
};
