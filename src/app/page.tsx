import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { ExtractResult } from "./types";

async function extractContent(url: string): Promise<ExtractResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  const html = await response.text();

  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article || !article.content) {
    throw new Error("Could not extract readable content");
  }

  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(article.content);

  return {
    title: article.title,
    markdown,
    excerpt: article.excerpt,
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { url?: string };
}) {
  let result: ExtractResult | null = null;
  let error: string | null = null;

  if (searchParams.url) {
    try {
      result = await extractContent(searchParams.url);
    } catch (err) {
      error = err instanceof Error ? err.message : "エラーが発生しました";
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          HTML to Markdown Converter
        </h1>
        <div className="max-w-3xl mx-auto">
          <form method="get" className="mb-12 bg-white rounded-lg shadow-lg p-6">
            <div className="flex gap-4">
              <input
                type="url"
                name="url"
                defaultValue={searchParams.url}
                placeholder="URLを入力してください"
                required
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
              >
                変換
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-medium">エラー</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-8 bg-white rounded-lg shadow-lg p-6">
              {result.title && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    タイトル
                  </h2>
                  <p className="text-gray-700">{result.title}</p>
                </div>
              )}
              
              {result.excerpt && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    抜粋
                  </h2>
                  <p className="text-gray-700">{result.excerpt}</p>
                </div>
              )}

              {result.markdown && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Markdown
                  </h2>
                  <pre className="p-4 bg-gray-50 rounded-lg overflow-auto text-gray-700 font-mono text-sm whitespace-pre-wrap">
                    {result.markdown}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
