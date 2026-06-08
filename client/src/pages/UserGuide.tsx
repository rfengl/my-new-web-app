import { useNavigate } from 'react-router-dom'

const sections = [
  { id: 'accessing', title: '1. Accessing the Portal' },
  { id: 'login',     title: '2. Logging In' },
  { id: 'viewing',   title: '3. Viewing Cases' },
  { id: 'creating',  title: '4. Creating a New Case' },
  { id: 'editing',   title: '5. Editing a Case' },
  { id: 'logout',    title: '6. Logging Out' },
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-white text-xs
                       flex items-center justify-center font-semibold mt-0.5">
        {number}
      </span>
      <p>{children}</p>
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
      <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-slate-500 text-sm">{children}</p>
    </div>
  )
}

function Badge({ color, label }: { color: 'green' | 'blue' | 'gray'; label: string }) {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    blue:  'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    gray:  'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[color]}`}>
      {label}
    </span>
  )
}

export default function UserGuide() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/cases')}
            className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-slate-800">User Guide</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-8">

        {/* Sidebar — Table of Contents */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              On this page
            </p>
            <nav className="space-y-1">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`}
                  className="block text-sm text-slate-500 hover:text-slate-800 py-1 transition-colors">
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-10 min-w-0">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">Case Portal — User Guide</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Learn how to log in, manage cases, and navigate the portal.
            </p>
          </div>

          {/* 1. Accessing */}
          <Section id="accessing" title="1. Accessing the Portal">
            <p>
              Open your web browser and navigate to the portal URL provided by your administrator.
            </p>
            <Note>During development the address is <strong>http://localhost:5173</strong></Note>
          </Section>

          {/* 2. Login */}
          <Section id="login" title="2. Logging In">
            <p>When you open the portal you will see the <strong>Sign In</strong> page.</p>
            <div className="space-y-2">
              <Step number={1}>Enter your <strong>email address</strong> in the Email field.</Step>
              <Step number={2}>Enter your <strong>password</strong> in the Password field.</Step>
              <Step number={3}>Click <strong>Sign in</strong>.</Step>
            </div>
            <p>
              If your credentials are correct you will be taken to the Case Listing page automatically.
              If they are wrong, an error message will appear — check your details and try again.
            </p>
            <Note>Demo account: admin@example.com / password123</Note>
          </Section>

          {/* 3. Viewing */}
          <Section id="viewing" title="3. Viewing Cases">
            <p>
              After logging in you will see the <strong>Cases</strong> page listing all cases in a table.
            </p>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Column</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['Case #',   'Unique identifier, e.g. C-001'],
                    ['Title',    'Short summary of the issue'],
                    ['Priority', 'How urgent the case is — High, Medium, or Low'],
                    ['Status',   'Current state of the case'],
                    ['Date',     'Date the case was created'],
                  ].map(([col, desc]) => (
                    <tr key={col}>
                      <td className="px-4 py-2.5 font-medium text-slate-700">{col}</td>
                      <td className="px-4 py-2.5 text-slate-500">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-medium text-slate-700">Status badge colours:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3"><Badge color="green" label="Open" /><span>Case is logged and waiting to be worked on.</span></div>
              <div className="flex items-center gap-3"><Badge color="blue"  label="In Progress" /><span>Case is actively being worked on.</span></div>
              <div className="flex items-center gap-3"><Badge color="gray"  label="Closed" /><span>Case has been resolved.</span></div>
            </div>
          </Section>

          {/* 4. Creating */}
          <Section id="creating" title="4. Creating a New Case">
            <div className="space-y-2">
              <Step number={1}>On the Cases page, click the <strong>+ New Case</strong> button in the top-right corner.</Step>
              <Step number={2}>You will be taken to the New Case form.</Step>
              <Step number={3}>Fill in the fields:</Step>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Field</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Required</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['Title',       'Yes', 'A short, clear summary of the issue'],
                    ['Description', 'No',  'Full details of the issue'],
                    ['Status',      'Yes', 'Start with Open for a new issue'],
                    ['Priority',    'Yes', 'Set to High, Medium, or Low'],
                  ].map(([field, req, desc]) => (
                    <tr key={field}>
                      <td className="px-4 py-2.5 font-medium text-slate-700">{field}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-medium ${req === 'Yes' ? 'text-red-500' : 'text-slate-400'}`}>{req}</span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-500">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-2">
              <Step number={4}>Click <strong>Create Case</strong> to save.</Step>
            </div>
            <p>You will be returned to the Cases page and the new case will appear at the top of the list.</p>
            <Note>Click Cancel or the back arrow at any time to go back without saving.</Note>
          </Section>

          {/* 5. Editing */}
          <Section id="editing" title="5. Editing a Case">
            <div className="space-y-2">
              <Step number={1}>On the Cases page, find the case you want to update.</Step>
              <Step number={2}>Click the <strong>Edit</strong> button on the right side of that row.</Step>
              <Step number={3}>The Edit Case form will open, pre-filled with the current details.</Step>
              <Step number={4}>Make your changes to any of the fields.</Step>
              <Step number={5}>Click <strong>Save Changes</strong> to save.</Step>
            </div>
            <p>You will be returned to the Cases page with the updated information.</p>
            <Note>Click Cancel or the back arrow to go back without saving any changes.</Note>
          </Section>

          {/* 6. Logout */}
          <Section id="logout" title="6. Logging Out">
            <p>
              Click <strong>Log out</strong> in the top-right corner of the Cases page.
              You will be returned to the Sign In page.
            </p>
            <Note>Always log out when you have finished, especially on a shared computer.</Note>
          </Section>

        </main>
      </div>
    </div>
  )
}
