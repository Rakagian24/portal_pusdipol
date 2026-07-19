
interface Article {
    id: number;
    title: string;
    authors: string;
    abstract?: string | null;
    issue_volume?: string | null;
    doi?: string | null;
    pdf_url?: string | null;
    published_date?: string | null;
    ojs_article_id: string;
    journal?: { name: string; ojs_base_url: string };
}

interface PublicArticleCardProps {
    article: Article;
    ojsBaseUrl?: string;
}

export default function PublicArticleCard({ article, ojsBaseUrl }: PublicArticleCardProps) {
    const baseUrl = ojsBaseUrl ?? article.journal?.ojs_base_url ?? '';

    return (
        <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#2596be]/40 hover:shadow-md">
            {/* Left accent bar */}
            <div className="flex gap-4">
                <div className="mt-1 w-1 shrink-0 rounded-full bg-[#2596be] transition-all duration-300 group-hover:bg-[#1f5476]" style={{ minHeight: '100%' }} />

                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="font-bold leading-snug text-[#1f5476] group-hover:text-[#2596be] transition-colors">
                        {article.title}
                    </h3>

                    {/* Authors */}
                    <p className="mt-1 text-sm text-gray-500 italic">{article.authors}</p>

                    {/* Badges */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        {article.journal && (
                            <span className="rounded-md bg-[#1f5476]/10 px-2 py-0.5 font-semibold text-[#1f5476]">
                                {article.journal.name}
                            </span>
                        )}
                        {article.issue_volume && (
                            <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-gray-600">

                                {article.issue_volume}
                            </span>
                        )}
                        {article.published_date && (
                            <span className="flex items-center gap-1 text-gray-400">

                                {new Date(article.published_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                            </span>
                        )}
                        {article.doi && (
                            <a
                                href={`https://doi.org/${article.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md border border-green-200 bg-green-50 px-2 py-0.5 font-mono font-medium text-green-700 transition hover:bg-green-100"
                            >
                                DOI
                            </a>
                        )}
                    </div>

                    {/* Abstract */}
                    {article.abstract && (
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
                            {article.abstract}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="mt-3 flex flex-wrap gap-3">
                        {baseUrl && (
                            <a
                                href={`${baseUrl}/article/view/${article.ojs_article_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2596be] transition hover:text-[#1f5476]"
                            >

                                Baca di OJS
                            </a>
                        )}
                        {article.pdf_url && (
                            <a
                                href={article.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#e62129] px-3 py-1 text-xs font-bold text-white transition hover:bg-[#c01820]"
                            >

                                PDF
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
