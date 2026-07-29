import argparse
import asyncio
import json
import os
from urllib.parse import urljoin, urlparse
from crawl4ai import AsyncWebCrawler

async def main():
    parser = argparse.ArgumentParser(description="Crawl all articles from a category URL")
    parser.add_argument("url", help="The category URL")
    parser.add_argument("--output", "-o", help="Output directory", default="docs/research/crawled_data")
    parser.add_argument("--limit", "-l", type=int, help="Maximum number of articles to crawl", default=0)
    
    args = parser.parse_args()
    category_url = args.url
    
    # Determine subfolder based on URL
    slug_cat = urlparse(category_url).path.strip("/").split("/")[-1]
    out_dir = os.path.join(args.output, slug_cat)
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"[*] Fetching category page: {category_url}")
    
    try:
        async with AsyncWebCrawler(verbose=True) as crawler:
            # 1. Fetch category page to get links
            result = await crawler.arun(url=category_url)
            if not result.success:
                print(f"[!] Failed to crawl category: {result.error_message}")
                return
            
            # Extract internal links from result
            article_links = set()
            internal_links = result.links.get("internal", [])
            print("Sample internal links:", [l.get("href") for l in internal_links[:10]])
            for link in internal_links:
                href = link.get("href", "")
                # Only grab links that belong to this category and end with .html
                if ("cong-trinh-tieu-bieu" in href or "tin-tuc" in href or "tu-van" in href) and href.endswith(".html"):
                    # ensure absolute url
                    full_url = urljoin(category_url, href)
                    article_links.add(full_url)
            
            if not article_links:
                print(f"[!] No article links found in {category_url}.")
                return
                
            article_links_list = list(article_links)
            if args.limit > 0:
                article_links_list = article_links_list[:args.limit]
                
            print(f"[*] Found {len(article_links_list)} articles to crawl.")
            
            # 2. Crawl each article
            for i, url in enumerate(article_links_list, 1):
                print(f"[{i}/{len(article_links_list)}] Crawling: {url}")
                art_result = await crawler.arun(url=url)
                if not art_result.success:
                    print(f"  [!] Failed: {art_result.error_message}")
                    continue
                
                slug = urlparse(url).path.strip("/").split("/")[-1].replace(".html", "")
                md_filename = os.path.join(out_dir, f"{slug}.md")
                meta_filename = os.path.join(out_dir, f"{slug}_meta.json")
                
                with open(md_filename, "w", encoding="utf-8") as f:
                    f.write(art_result.markdown)
                    
                metadata = {
                    "url": url,
                    "title": art_result.metadata.get("title", ""),
                    "description": art_result.metadata.get("description", ""),
                    "images": [img for img in art_result.media.get("images", []) if img.get("score", 0) > 4],
                }
                
                with open(meta_filename, "w", encoding="utf-8") as f:
                    json.dump(metadata, f, indent=2, ensure_ascii=False)
                    
                print(f"  [+] Saved {slug}")
                
            print("[*] Batch crawl completed successfully!")
            
    except Exception as e:
        print(f"[!] Error during crawling: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
