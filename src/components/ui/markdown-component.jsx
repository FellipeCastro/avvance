import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "./markdown-component.module.css";

export default function MarkdownComponent({ children, className }) {
    return (
        <div className={`${styles.markdown} ${className}`}>
            <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
        </div>
    );
}
