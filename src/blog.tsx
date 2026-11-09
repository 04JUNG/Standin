import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BlogPage } from './pages/BlogPage';
import { blogPosts, blogPath } from './data/blog';
import './styles/globals.css';
const path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/?$/, '/');
const post = blogPosts.find(p => blogPath(p) === path);
if (post || path === '/blog/') {
  const root = document.getElementById('root')!;
  const page = <StrictMode><BlogPage post={post} /></StrictMode>;
  if (root.hasChildNodes()) hydrateRoot(root, page); else createRoot(root).render(page);
}
