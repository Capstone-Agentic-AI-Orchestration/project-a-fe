export interface AppProps {
  title?: string;
}

export function App({ title = 'project-a-fe' }: AppProps) {
  return (
    <main>
      <a className="skip-link" href="#about">Skip to content</a>
      <header className="site-header"><a className="brand" href="#home"><span className="brand-mark" aria-hidden="true">A</span><span>{title}</span></a><nav aria-label="Main navigation"><a href="#about">About</a><a href="#approach">Our approach</a><a href="#contact">Contact</a></nav></header>
      <section className="hero" id="home" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">A place to begin</p><h1 id="hero-title">Good things grow from a clear purpose.</h1><p className="hero-lede">Project A is an informational space for sharing what we do, why it matters, and how to take part.</p><a className="button-link" href="#about">Get to know us ↓</a></div><div className="hero-art" aria-hidden="true"><div className="sun" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="art-label">Ideas into action</div></div></section>
      <section className="intro section-wrap" id="about" aria-labelledby="about-title"><div><p className="eyebrow">About Project A</p><h2 id="about-title">A simple place to find the bigger picture.</h2></div><p>We bring useful information together so people can understand the project, follow its progress, and find a meaningful next step. As the work grows, this page will share the latest details and ways to get involved.</p></section>
      <section className="approach" id="approach" aria-labelledby="approach-title"><div className="section-wrap"><p className="eyebrow">What guides us</p><h2 id="approach-title">Clear, thoughtful, and open.</h2><div className="principles"><article><span className="principle-number">01</span><h3>Make it understandable</h3><p>We explain the essentials in plain language and keep information easy to find.</p></article><article><span className="principle-number">02</span><h3>Keep people in the loop</h3><p>We share progress and useful updates as the project takes shape.</p></article><article><span className="principle-number">03</span><h3>Welcome participation</h3><p>We make room for questions, ideas, and the people who want to contribute.</p></article></div></div></section>
      <section className="contact section-wrap" id="contact" aria-labelledby="contact-title"><div><p className="eyebrow">Stay connected</p><h2 id="contact-title">Curious about Project A?</h2></div><p>Have a question or want to learn more? Reach out and start a conversation.</p><a className="text-link" href="mailto:hello@projecta.example">hello@projecta.example ↗</a></section>
    </main>
  );
}
