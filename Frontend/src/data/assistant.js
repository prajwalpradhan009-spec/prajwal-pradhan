import { profile } from './profile.js'
import { projects } from './projects.js'
import { skills } from './skills.js'

export function localReply(message) {
  const q = message.toLowerCase()
  const project = projects.find(
    (p) =>
      q.includes(p.title.toLowerCase()) ||
      q.includes(p.repo.toLowerCase()) ||
      (p.theme === 'pdf' && q.includes('northstar'))
  )
  if (project)
    return (
      project.title +
      ' — ' +
      project.description +
      ' The stack includes ' +
      project.stack.join(', ') +
      '.'
    )
  if (/project|work sample|built|portfolio/.test(q))
    return (
      'The selected projects are ' +
      projects.map((p) => p.title).join(', ') +
      '. You can find their source code in the Projects section. Ask about any one of them for more detail.'
    )
  if (/skill|stack|technolog|technical|python|react/.test(q))
    return (
      'Prajwal builds with ' +
      skills
        .slice(0, 3)
        .map((g) => g.items.slice(0, 2).join(' and '))
        .join(', ') +
      '. His work spans interfaces, REST APIs and local AI tools.'
    )
  if (/hire|availab|contact|email|internship|collaborat/.test(q))
    return (
      'Prajwal is open to internships and collaborations. Email ' +
      profile.email +
      ' or send a message through the contact form.'
    )
  if (/github|repo/.test(q))
    return (
      'His GitHub username is ' +
      profile.github +
      '. The GitHub section shows his recent public repositories and contributions.'
    )
  if (/educat|learn|about|who|bio|study|studying|student|hello|^hi\b/.test(q))
    return 'Prajwal is a BCA student at Sikkim Alpine University and a full-stack developer. He builds web applications and Python tools, and serves as Social Media Director at NewarPrime.'
  return 'I don’t have that detail in Prajwal’s portfolio. I can help with his projects, skills, education or contact information.'
}
export function assistantContext() {
  return (
    'You are Prajwal’s portfolio assistant. Answer briefly about his professional work using only these public facts. If a detail is missing, say so. Stay on topic.\n' +
    JSON.stringify({
      name: profile.name,
      bio: profile.bio,
      availability: profile.availability,
      email: profile.email,
      location: profile.location,
      skills,
      projects,
    })
  )
}
