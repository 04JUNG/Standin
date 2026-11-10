import { useState } from 'react';
import { BrandMark } from '../components/common/BrandMark';
import { Container } from '../components/common/Container';
import { Footer } from '../components/layout/Footer';
import { blogPosts, blogPath, blogDescription, type BlogPost } from '../data/blog';
import { site } from '../data/site';
import { blogVisuals, type BlogVisual } from '../data/blogVisuals';
import '../styles/blog.css';

function BlogFigure({ visual, priority = false }: { visual: BlogVisual; priority?: boolean }) {
  const [playing, setPlaying] = useState(Boolean(visual.animation));
  const displayedSource = playing && visual.animation ? visual.animation.src : visual.src;
  const media = <img key={displayedSource} src={displayedSource} width={visual.width} height={visual.height} alt={visual.alt} loading={priority || playing ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : undefined} />;
  return <figure className="blog-figure">
    {visual.animation ? <>
      <button className="blog-gif-toggle" type="button" onClick={() => setPlaying(value => !value)} aria-pressed={playing} aria-label={`${visual.animation.label} — ${playing ? 'GIF 정지' : 'GIF 재생'}`}>
        {media}
        <span className="blog-gif-hint" aria-hidden="true">{playing ? 'Ⅱ 이미지 눌러 정지' : '▶ 이미지 눌러 재생'}</span>
      </button>
      <a className="blog-gif-original" href={displayedSource} target="_blank" rel="noopener noreferrer">원본 크게 보기 ↗<span className="sr-only"> (새 창)</span></a>
    </> : <a href={displayedSource} target="_blank" rel="noopener noreferrer" aria-label={`${visual.alt} — 원본 이미지 크게 보기 (새 창)`}>
      {media}
      <span className="blog-image-zoom" aria-hidden="true">크게 보기 ↗</span>
    </a>}
    <figcaption>{visual.caption}</figcaption>
  </figure>;
}

export function BlogPage({ post }: { post?: BlogPost }) {
  const visuals = post ? blogVisuals[post.slug] : undefined;
  const postIndex = post ? blogPosts.findIndex(item => item.slug === post.slug) : -1;
  const previousPost = postIndex > 0 ? blogPosts[postIndex - 1] : undefined;
  const nextPost = postIndex >= 0 ? blogPosts[postIndex + 1] : undefined;
  return <>
    <a className="skip-link" href="#main-content">본문으로 바로가기</a>
    <header className={`blog-header${post ? ' blog-header--reading' : ''}`}><Container><div className="blog-header-row"><a href="/" aria-label="Standin 홈"><BrandMark className="text-xl" /></a><nav aria-label="블로그 메뉴"><a href="/blog/">{post ? '모든 글' : '블로그'}</a></nav></div></Container></header>
    <main id="main-content" className="blog-main"><Container>
      {post ? <article className="blog-article" id="blog-content">
        <header id="article-intro" data-reading-section="article-intro">
          <a className="blog-back" href="/blog/">← 모든 글</a><p className="blog-eyebrow">{post.category}</p>
          <h1>{post.title}</h1><p className="blog-lead">{post.description}</p>
          <p className="blog-meta"><a href="/" rel="author">{site.team}</a> · 게시 <time dateTime={post.date}>{post.date}</time> · 수정 <time dateTime={post.modifiedAt}>{post.modifiedAt}</time> · 데스크톱 작업 기준</p>
          {post.takeaway && <aside className="blog-takeaway" aria-label="핵심 답변"><strong>{post.takeaway.title}</strong><p>{post.takeaway.text}</p></aside>}
          {visuals && <BlogFigure visual={visuals.cover} priority />}
          <nav className="blog-toc" aria-label="글 목차"><h2>이 글에서 다루는 내용</h2><ol>{post.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}<li><a href="#article-questions">자주 묻는 질문</a></li><li><a href="#article-sources">참고 자료와 확인 기준</a></li></ol></nav>
        </header>
        {post.sections.map(section => <section className="blog-section" id={section.id} data-reading-section={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {visuals?.sections[section.id] && <BlogFigure visual={visuals.sections[section.id]} />}
          {section.paragraphs.map(p => <p key={p}>{p}</p>)}
          {section.table && <div className="blog-table-wrap" role="region" aria-label="BVH와 FBX 비교표" tabIndex={0}><table><thead><tr>{section.table.headers.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>}
          {section.steps && <ol className="blog-steps">{section.steps.map(step => <li key={step}>{step}</li>)}</ol>}
          {section.links && <ul className="blog-links">{section.links.map(link => <li key={link.href}><a href={link.href}>{link.label} →</a></li>)}</ul>}
        </section>)}
        <section id="article-questions" data-reading-section="article-questions" className="blog-section blog-questions" aria-labelledby="article-questions-title">
          <h2 id="article-questions-title">자주 묻는 질문</h2>
          {post.questions.map(item => <section id={`question-${item.id}`} key={item.id}>
            <h3>{item.question}</h3><p>{item.answer}</p><a href={item.href}>관련 설명 보기 →</a>
          </section>)}
        </section>
        <section id="article-sources" data-reading-section="article-sources" className="blog-section blog-sources"><h2>참고 자료</h2><p>문서 확인일: {post.modifiedAt}. 파일 형식과 메뉴 가져오기는 공식 문서를, Standin에서 직접 드래그하는 흐름은 앱 구현과 팀의 사용 검증을 기준으로 설명했습니다. 실제 적용 결과는 사용 버전과 파일 구성에 따라 확인하세요.</p><ul>{post.sources.map(source => <li key={source.href}><a href={source.href}>{source.label}</a></li>)}</ul></section>
        <aside id="article-related" data-reading-section="article-related" className="blog-related">
          <div className="blog-related-heading"><h2 id="blog-navigation-title">이어서 읽기</h2><a className="blog-all-posts" href="/blog/">모든 글 보기 <span aria-hidden="true">↗</span></a></div>
          <nav className="blog-post-navigation" aria-labelledby="blog-navigation-title">
            {previousPost && <a className="blog-post-link" href={blogPath(previousPost)} rel="prev">
              <span className="blog-post-direction"><span aria-hidden="true">← </span>이전 글</span>
              <strong>{previousPost.title}</strong><span className="blog-post-category">{previousPost.category}</span>
            </a>}
            {nextPost && <a className="blog-post-link blog-post-link--next" href={blogPath(nextPost)} rel="next">
              <span className="blog-post-direction">다음 글<span aria-hidden="true"> →</span></span>
              <strong>{nextPost.title}</strong><span className="blog-post-category">{nextPost.category}</span>
            </a>}
          </nav>
        </aside>
      </article> : <div className="blog-index" id="blog-list" data-reading-section="blog-list"><p className="blog-eyebrow">STANDIN JOURNAL</p><h1>Standin 블로그: 클립스튜디오 3D 포즈와 BVH·FBX 사용법</h1><p className="blog-lead">{blogDescription}</p><div className="blog-cards">{blogPosts.map((p, i) => <a className="blog-card" href={blogPath(p)} key={p.slug}><img className="blog-card-cover" src={blogVisuals[p.slug].cover.src} width={blogVisuals[p.slug].cover.width} height={blogVisuals[p.slug].cover.height} alt="" loading="lazy" decoding="async" /><span className="blog-card-number">0{i + 1}</span><p className="blog-eyebrow">{p.category}</p><h2>{p.title}</h2><p>{p.description}</p><span className="blog-meta">{p.date} · 글 읽기 →</span></a>)}</div></div>}
    </Container></main><Footer />
  </>;
}
