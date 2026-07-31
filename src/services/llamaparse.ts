// @ts-nocheck
/**
 * Service to interact with the LlamaParse API.

 * Uses native fetch and FormData (Node.js 18+ / Next.js 15) to perform REST calls.
 */
export class LlamaParseService {
  private static getApiKey(): string | null {
    return (
      process.env.LLAMA_PARSE_API_KEY ||
      process.env.LLAMA_CLOUD_API_KEY ||
      null
    );
  }

  /**
   * Uploads a file buffer and parses it using LlamaParse.
   * Returns markdown content on success, or null on failure/disabled.
   */
  public static async parsePdf(
    fileName: string,
    fileBuffer: Buffer
  ): Promise<string | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn("[LlamaParseService] LLAMA_PARSE_API_KEY not configured. Skipping LlamaParse.");
      return null;
    }

    console.log(`[LlamaParseService] Uploading ${fileName} (${fileBuffer.length} bytes)...`);

    try {
      // 1. Create native FormData
      const formData = new FormData();
      
      // Node.js 18+ native Blob is supported globally or can be imported.
      const blob = new Blob([fileBuffer], { type: "application/pdf" });
      formData.append("file", blob, fileName);
      formData.append("gpt4o_mode", "true"); // High accuracy mode
      formData.append("result_type", "markdown");

      // 2. POST to LlamaParse upload endpoint
      const uploadResponse = await fetch("https://api.cloud.llamaindex.ai/api/v1/parsing/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error(`[LlamaParseService] Upload failed: ${uploadResponse.status} - ${errorText}`);
        return null;
      }

      const uploadData = await uploadResponse.json();
      const jobId = uploadData.id;
      if (!jobId) {
        console.error("[LlamaParseService] No jobId returned from upload.", uploadData);
        return null;
      }

      console.log(`[LlamaParseService] Job started with ID: ${jobId}. Polling status...`);

      // 3. Poll for job completion
      const maxRetries = 25; // Max 37.5 seconds (25 * 1.5s)
      let attempts = 0;
      let completed = false;

      // First check after 1 second (LlamaParse is often very fast)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      while (attempts < maxRetries) {
        attempts++;
        if (attempts > 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5s between polls
        }

        const statusResponse = await fetch(
          `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}`,
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`
            }
          }
        );

        if (!statusResponse.ok) {
          console.warn(`[LlamaParseService] Poll status request failed (${statusResponse.status}). Retrying...`);
          continue;
        }

        const statusData = await statusResponse.json();
        const status = statusData.status;

        console.log(`[LlamaParseService] Job ${jobId} status (Attempt ${attempts}/${maxRetries}): ${status}`);

        if (status === "SUCCESS") {
          completed = true;
          break;
        } else if (status === "FAILED" || status === "ERROR") {
          console.error(`[LlamaParseService] Job failed on server:`, statusData.error || statusData.message);
          return null;
        }
      }

      if (!completed) {
        console.error(`[LlamaParseService] Job ${jobId} timed out after polling.`);
        return null;
      }

      // 4. Retrieve Markdown result
      console.log(`[LlamaParseService] Job ${jobId} complete. Fetching Markdown result...`);
      const resultResponse = await fetch(
        `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}/result/markdown`,
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`
          }
        }
      );

      if (!resultResponse.ok) {
        const errorText = await resultResponse.text();
        console.error(`[LlamaParseService] Failed to retrieve markdown: ${resultResponse.status} - ${errorText}`);
        return null;
      }

      const resultData = await resultResponse.json();
      return resultData.markdown || resultData.text || null;

    } catch (err: any) {
      console.error("[LlamaParseService] Exception in parsePdf:", err.message || err);
      return null;
    }
  }
}
