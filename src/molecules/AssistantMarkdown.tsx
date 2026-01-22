import ReactMarkdown from "react-markdown";
// import SyntaxHighlighter from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import ToolsTable, { type Tool } from "../components/ToolsTable";
import type { ScoresData } from "../components/ScoresTable";
import ScoresTable from "../components/ScoresTable";

export type AssistantMarkdownMessageProps = {content: string, tools?: Tool[], scores?: ScoresData};

const AssistantMarkdownMessage = ({ content, tools, scores }: AssistantMarkdownMessageProps) => {
    console.log("Rendering AssistantMarkdownMessage with content:", content);

    return (
  <div>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      // components={{
      //   code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children: React.ReactNode }) {
      //     const match = /language-(\w+)/.exec(className || '');
      //     return !inline && match ? (
      //       <SyntaxHighlighter
      //         language={match[1]}
      //         PreTag="div"
      //         style={oneDark as unknown as { [key: string]: React.CSSProperties }}
      //         {...props}
      //       >
      //         {String(children).replace(/\n$/, '')}
      //       </SyntaxHighlighter>
      //     ) : (
      //       <code className={className} {...props}>
      //         {children}
      //       </code>
      //     );
      //   },
      // }}
    >
      {content}
    </ReactMarkdown>
    {tools && tools.length > 0 && <ToolsTable tools={tools || []} />}
    {scores && scores.categories.length > 0 && ( <ScoresTable scoresData={scores} />)}
  </div>
)}

export default AssistantMarkdownMessage;