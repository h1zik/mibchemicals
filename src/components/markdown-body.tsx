import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
  className?: string;
};

export function MarkdownBody({ content, className }: Props) {
  return (
    <div
      className={
        "prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-mib prose-strong:text-foreground " +
        (className ?? "")
      }
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
