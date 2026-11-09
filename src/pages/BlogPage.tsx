import { BrandMark } from '../components/common/BrandMark';
import { Container } from '../components/common/Container';
import { Footer } from '../components/layout/Footer';
import { blogPosts, blogPath, blogDescription, type BlogPost } from '../data/blog';
import { site } from '../data/site';
import { blogVisuals, type BlogVisual } from '../data/blogVisuals';
import '../styles/blog.css';

function BlogFigure({ visual, priority = false }: { visual: BlogVisual; priority?: boolean }) {
  return <figure className="blog-figure">
    <a href={visual.src} target="_blank" rel="noopener noreferrer" aria-label={`${visual.alt} — 원본 이미지 크게 보기 (새 창)`}>
      <img src={visual.src} width={visual.width} height={visual.height} alt={visual.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : undefined} />
      <span className="blog-image-zoom" aria-hidden="true">크게 보기 ↗</span>
    </a>
    <figcaption>{visual.caption}</figcaption>
  </figure>;
}

export function BlogPage({ post }: { post?: BlogPost }) {
  const visuals = post ? blogVisuals[post.slug] : undefined;
  return <>
    <a className="skip-link" href="#main-content">본문으로 바로가기</a>
    <header className="blog-header"><Container><div className="blog-header-row"><a href="/" aria-label="Standin 홈"><BrandMark className="text-xl" /></a><nav aria-label="블로그 메뉴"><a href="/blog/">블로그</a><a href="/#beta">오픈베타 다운로드</a></nav></div></Container></header>
    <main id="main-content" className="blog-main"><Container>
      {post ? <article className="blog-article" id="blog-content">
        <header id="article-intro" data-reading-section="article-intro">
          <a className="blog-back" href="/blog/">← 모든 글</a><p className="blog-eyebrow">{post.category}</p>
          <h1>{post.title}</h1><p className="blog-lead">{post.description}</p>
          <p className="blog-meta">{site.team} · <time dateTime={post.date}>{post.date}</time> · 데스크톱 작업 기준</p>
          {visuals && <BlogFigure visual={visuals.cover} priority />}
          <nav className="blog-toc" aria-label="글 목차"><h2>이 글에서 다루는 내용</h2><ol>{post.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>
        </header>
        {post.sections.map(section => <section className="blog-section" id={section.id} data-reading-section={section.id} key={section.id}>
          <h2>{section.title}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}
          {section.table && <div className="blog-table-wrap" role="region" aria-label="BVH와 FBX 비교표" tabIndex={0}><table><thead><tr>{section.table.headers.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>}
          {section.steps && <ol className="blog-steps">{section.steps.map(step => <li key={step}>{step}</li>)}</ol>}
          {visuals?.sections[section.id] && <BlogFigure visual={visuals.sections[section.id]} />}
          {section.links && <ul className="blog-links">{section.links.map(link => <li key={link.href}><a href={link.href}>{link.label} →</a></li>)}</ul>}
        </section>)}
        <section id="article-sources" data-reading-section="article-sources" className="blog-section blog-sources"><h2>참고 자료</h2><p>확인일: {post.date}. 파일 형식과 가져오기 절차는 공식 문서 기준이며, 실제 결과는 사용 버전과 파일 구성에 따라 확인하세요.</p><ul>{post.sources.map(source => <li key={source.href}><a href={source.href}>{source.label}</a></li>)}</ul></section>
        <aside id="article-related" data-reading-section="article-related" className="blog-related"><h2>함께 읽으면 좋은 글</h2>{blogPosts.filter(p => p.slug !== post.slug).map(p => <a key={p.slug} href={blogPath(p)}>{p.title} →</a>)}<a className="blog-cta" href="/#beta">Standin 다운로드</a></aside>
      </article> : <div className="blog-index" id="blog-list" data-reading-section="blog-list"><p className="blog-eyebrow">STANDIN JOURNAL</p><h1>러프 다음의 작업을 위한 이야기</h1><p className="blog-lead">{blogDescription}</p><div className="blog-cards">{blogPosts.map((p, i) => <a className="blog-card" href={blogPath(p)} key={p.slug}><img className="blog-card-cover" src={blogVisuals[p.slug].cover.src} width={900} height={600} alt="" loading="lazy" decoding="async" /><span className="blog-card-number">0{i + 1}</span><p className="blog-eyebrow">{p.category}</p><h2>{p.title}</h2><p>{p.description}</p><span className="blog-meta">{p.date} · 글 읽기 →</span></a>)}</div></div>}
    </Container></main><Footer />
  </>;
}
