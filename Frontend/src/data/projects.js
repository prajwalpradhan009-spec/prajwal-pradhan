import { profile } from './profile.js'

export const projects = [
  {
    title: 'NovaCart',
    category: 'E-commerce',
    theme: 'store',
    description:
      'An online store built from the database up. Browse products, save a wishlist and follow an order through checkout.',
    stack: ['React', 'Node.js', 'MySQL'],
    repo: 'E-com-NovaCart',
  },
  {
    title: 'Northstar PDF',
    category: 'Document tools',
    theme: 'pdf',
    description:
      'A focused workspace for merging and compressing PDFs, with a Python processing service behind the interface.',
    stack: ['React', 'Python', 'MongoDB'],
    repo: '-Northstar-Compress-PDF',
  },
  {
    title: 'AI Voice Agent',
    category: 'Voice interface',
    theme: 'voice',
    description:
      'A local voice assistant that listens with Whisper, reasons with Ollama and speaks through Kokoro.',
    stack: ['FastAPI', 'Ollama', 'Whisper'],
    repo: 'PERSONAL-Al-AGENT',
  },
  {
    title: 'Developer Portfolio',
    category: 'Interactive web',
    theme: 'folio',
    description:
      'The site you’re exploring. A personal workspace for selected projects, a live GitHub feed and a portfolio assistant.',
    stack: ['React', 'GSAP', 'Express'],
    repo: 'prajwal-portfolio',
    live: '#home',
  },
].map((project) => ({ ...project, url: profile.socials.GitHub + '/' + project.repo }))
