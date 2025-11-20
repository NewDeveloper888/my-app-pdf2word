/**
 * Converts a File object to a Base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Generates a downloadable Word document from HTML content.
 * We use a special HTML wrapper that Word interprets correctly.
 */
export const downloadWordFile = (contentHtml: string, fileName: string) => {
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Export HTML to Word Document with JavaScript</title>
      <style>
        body { font-family: 'Arial', 'Cairo', sans-serif; }
      </style>
    </head>
    <body style="direction: rtl; text-align: right;">
  `;
  
  const footer = "</body></html>";
  const sourceHTML = header + contentHtml + footer;

  const blob = new Blob(['\ufeff', sourceHTML], {
    type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Ensure filename ends in .doc (simple HTML wrapper) or .docx if we had a complex packer
  // .doc is safer for simple HTML-based conversion without heavy libraries
  const cleanName = fileName.replace(/\.pdf$/i, '');
  link.href = url;
  link.download = `${cleanName}_converted.doc`;
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};