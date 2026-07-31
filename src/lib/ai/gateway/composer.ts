export class ResponseComposer {
  /**
   * Post-processes the LLM text output.
   * Checks for contradictions and ensures proper citation placement.
   */
  public static composeResponse(
    responseText: string, 
    citationsText: string, 
    intent: string
  ): string {
    let finalOutput = responseText;

    // 1. Detect if response contains pricing/dimensional conflict keywords
    const hasPricingConflict = 
      (responseText.includes('giá') || responseText.includes('VNĐ')) && 
      (responseText.includes('tuy nhiên') || responseText.includes('khác biệt') || responseText.includes('mâu thuẫn'));

    if (hasPricingConflict) {
      const warningText = `\n\n> [!CAUTION]\n> **Lưu ý kỹ thuật**: Phát hiện thông tin báo giá hoặc thông số kỹ thuật có sự sai lệch giữa các tài liệu. Ưu tiên áp dụng thông tin từ bảng báo giá chính thống có trích dẫn nguồn ở dưới.`;
      finalOutput = warningText + '\n\n' + finalOutput;
    }

    // 2. Append formatted citations if present
    if (citationsText) {
      finalOutput += citationsText;
    }

    // 3. For pricing intent, automatically append the general customer lead capture note
    if (intent === 'pricing') {
      finalOutput += `\n\n> [!NOTE]\n> *Để nhận bản báo giá dự toán chi tiết và chính xác nhất cho công trình của mình, quý khách vui lòng để lại Số điện thoại hoặc liên hệ Hotline: 0966 994 338.*`;
    }

    return finalOutput;
  }
}
