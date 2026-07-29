import argparse
import asyncio
import json
import os
from urllib.parse import urlparse
from crawl4ai import AsyncWebCrawler

async def main():
    parser = argparse.ArgumentParser(description="Fetch clean markdown from a URL using Crawl4AI")
    parser.add_argument("url", help="The URL to fetch")
    parser.add_argument("--output", "-o", help="Output directory", default="docs/research/crawled_data")
    
    args = parser.parse_args()
    url = args.url
    out_dir = args.output
    
    # Create output dir if it doesn't exist
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"[*] Starting Crawl4AI for: {url}")
    
    try:
        async with AsyncWebCrawler(verbose=True) as crawler:
            # Run crawler. This automatically extracts clean markdown, metadata, and filters out boilerplate.
            result = await crawler.arun(url=url)
            
            if not result.success:
                print(f"[!] Failed to crawl {url}: {result.error_message}")
                return
                
            # Parse URL to generate a filename
            parsed_url = urlparse(url)
            slug = parsed_url.path.strip("/").split("/")[-1] or parsed_url.netloc
            
            md_filename = os.path.join(out_dir, f"{slug}.md")
            meta_filename = os.path.join(out_dir, f"{slug}_meta.json")
            
            # Save Markdown
            with open(md_filename, "w", encoding="utf-8") as f:
                f.write(result.markdown)
                
            # Save Metadata and extracted images
            metadata = {
                "url": url,
                "title": result.metadata.get("title", ""),
                "description": result.metadata.get("description", ""),
                "images": [img for img in result.media.get("images", []) if img.get("score", 0) > 4], # Filter high relevance images
                "author": result.metadata.get("author", ""),
                "published_time": result.metadata.get("published_time", "")
            }
            
            with open(meta_filename, "w", encoding="utf-8") as f:
                json.dump(metadata, f, indent=2, ensure_ascii=False)
                
            print(f"[+] Success!")
            print(f"    - Markdown saved to: {md_filename}")
            print(f"    - Metadata saved to: {meta_filename}")
            
    except Exception as e:
        print(f"[!] Error during crawling: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
