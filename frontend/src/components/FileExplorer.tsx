import React, { useState } from 'react';

interface FileExplorerProps {
  files: Array<{ path: string; content: string }>;
}

interface TreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children: TreeNode[];
  size: number;
}

export default function FileExplorer({ files }: FileExplorerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['root']));

  const buildTree = (): TreeNode[] => {
    const root: Record<string, TreeNode> = {};

    files.forEach(({ path, content }) => {
      const parts = path.split('/').filter(Boolean);
      let current: Record<string, TreeNode> = root;

      parts.forEach((part, idx) => {
        if (!current[part]) {
          const isLast = idx === parts.length - 1;
          current[part] = {
            name: part,
            path: '/' + parts.slice(0, idx + 1).join('/'),
            isDirectory: !isLast,
            children: [],
            size: isLast ? content.length : 0,
          };
        }
        current = current[part].children as any;
      });
    });

    return Object.values(root);
  };

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const renderTree = (nodes: TreeNode[], level: number = 0) => {
    return (
      <ul className="file-tree" style={{ paddingLeft: `${level * 20}px` }}>
        {nodes.map((node) => (
          <li key={node.path} className="file-item">
            <div
              className="file-label"
              onClick={() => node.isDirectory && toggleExpanded(node.path)}
              style={{ cursor: node.isDirectory ? 'pointer' : 'default' }}
            >
              {node.isDirectory && (
                <span className={`arrow ${expanded.has(node.path) ? 'expanded' : ''}`}>▶</span>
              )}
              <span className={`icon ${node.isDirectory ? 'folder' : 'file'}`}>
                {node.isDirectory ? '📁' : '📄'}
              </span>
              <span className="name">{node.name}</span>
              {!node.isDirectory && <span className="size">({node.size}B)</span>}
            </div>
            {node.isDirectory && expanded.has(node.path) && node.children.length > 0 && (
              <>{renderTree(node.children, level + 1)}</>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const tree = buildTree();

  return (
    <div className="file-explorer">
      <h3>Files</h3>
      <div className="explorer-content">
        {tree.length > 0 ? renderTree(tree) : <p className="empty">No files</p>}
      </div>
    </div>
  );
}
