import { useNavigate } from 'react-router-dom'

// ─── Primitives ──────────────────────────────────────────────────────────────

const METHOD_STYLES = {
  GET:    'bg-emerald-100 text-emerald-700',
  POST:   'bg-blue-100 text-blue-700',
  PUT:    'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-700',
}

type MethodKey = keyof typeof METHOD_STYLES

function MethodBadge({ method }: { method: MethodKey }) {
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${METHOD_STYLES[method]}`}>
      {method}
    </span>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed">
      <code>{children}</code>
    </pre>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-slate-100 text-slate-700 text-xs px-1.5 py-0.5 rounded font-mono">
      {children}
    </code>
  )
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
      {children}
    </h2>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-slate-700 mb-2">{children}</h3>
}

function ParamTable({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 text-sm mb-4">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {['Name', 'Type', 'Required', 'Description'].map(h => (
              <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-slate-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(([name, type, req, desc]) => (
            <tr key={name}>
              <td className="px-3 py-2 font-mono text-xs text-slate-700">{name}</td>
              <td className="px-3 py-2 text-xs text-blue-600 font-mono">{type}</td>
              <td className="px-3 py-2 text-xs">
                <span className={req === 'Yes' ? 'text-red-500 font-medium' : 'text-slate-400'}>{req}</span>
              </td>
              <td className="px-3 py-2 text-xs text-slate-500">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Endpoint({ method, path, description, children }: {
  method: MethodKey
  path: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
      <div className="bg-slate-50 px-4 py-3 flex items-center gap-3 border-b border-slate-200">
        <MethodBadge method={method} />
        <code className="text-sm text-slate-700 font-mono">{path}</code>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-sm text-slate-600">{description}</p>
        {children}
      </div>
    </div>
  )
}

// ─── Nav sections ─────────────────────────────────────────────────────────────

const nav = [
  { id: 'overview',     label: 'Overview' },
  { id: 'auth',         label: 'Authentication' },
  { id: 'cases',        label: 'Cases' },
  { id: 'errors',       label: 'Error Reference' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApiDocs() {
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
          <h1 className="font-semibold text-slate-800">API Documentation</h1>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">v1</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-8">

        {/* Sidebar */}
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Contents</p>
            {nav.map(n => (
              <a key={n.id} href={`#${n.id}`}
                className="block text-sm text-slate-500 hover:text-slate-800 py-1 transition-colors">
                {n.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 space-y-12">

          {/* Overview */}
          <section id="overview" className="scroll-mt-24">
            <SectionHeading id="overview">Overview</SectionHeading>
            <div className="space-y-4 text-sm text-slate-600">
              <p>
                The Case Portal REST API allows you to programmatically manage cases.
                All requests and responses use <InlineCode>application/json</InlineCode>.
              </p>

              <div>
                <SubHeading>Base URL</SubHeading>
                <Code>{`http://localhost:5003   (development)`}</Code>
                <p className="text-xs text-slate-400 mt-1">
                  Interactive Swagger UI is available at{' '}
                  <a href="http://localhost:5003/swagger" target="_blank" rel="noreferrer"
                    className="underline hover:text-slate-600">
                    http://localhost:5003/swagger
                  </a>{' '}
                  while the backend is running in development mode.
                </p>
              </div>

              <div>
                <SubHeading>Request Headers</SubHeading>
                <ParamTable rows={[
                  ['Content-Type',  'string', 'Yes', 'Must be application/json'],
                  ['Authorization', 'string', 'Yes*','Bearer <token> — required for all protected endpoints'],
                ]} />
                <p className="text-xs text-slate-400">* Not required for POST /api/auth/login</p>
              </div>

              <div>
                <SubHeading>Data Types</SubHeading>
                <ParamTable rows={[
                  ['string',  'string',  '—', 'UTF-8 text'],
                  ['integer', 'integer', '—', 'Whole number'],
                  ['boolean', 'boolean', '—', 'true or false'],
                  ['enum',    'string',  '—', 'One of a fixed set of values (listed per field)'],
                  ['ISO date','string',  '—', 'Date in YYYY-MM-DD format'],
                ]} />
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section id="auth" className="scroll-mt-24">
            <SectionHeading id="auth">Authentication</SectionHeading>
            <p className="text-sm text-slate-600 mb-4">
              The API uses <strong>Bearer token</strong> authentication. Call the login endpoint to
              receive a JWT token, then include it in the <InlineCode>Authorization</InlineCode> header
              of every subsequent request.
            </p>

            <Endpoint method="POST" path="/api/auth/login" description="Authenticate a user and return a JWT access token.">
              <div>
                <SubHeading>Request Body</SubHeading>
                <ParamTable rows={[
                  ['email',    'string', 'Yes', 'The user\'s email address'],
                  ['password', 'string', 'Yes', 'The user\'s password'],
                ]} />
                <Code>{`{
  "email": "admin@example.com",
  "password": "password123"
}`}</Code>
                <p className="text-xs text-slate-400 mt-1">
                  Demo credentials: <strong className="text-slate-600">admin@example.com</strong> / <strong className="text-slate-600">password123</strong>
                </p>
              </div>
              <div>
                <SubHeading>Response — 200 OK</SubHeading>
                <Code>{`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}`}</Code>
                <p className="text-xs text-slate-400 mt-1">
                  Store the <InlineCode>token</InlineCode> and send it as <InlineCode>Authorization: Bearer &lt;token&gt;</InlineCode> on every subsequent request.
                  The token is valid for <InlineCode>expiresIn</InlineCode> seconds (24 hours).
                </p>
              </div>
            </Endpoint>

            <Endpoint method="POST" path="/api/auth/logout" description="End the current session. The token is discarded client-side.">
              <div>
                <SubHeading>Response — 204 No Content</SubHeading>
                <Code>{`(empty body)`}</Code>
              </div>
            </Endpoint>
          </section>

          {/* Cases */}
          <section id="cases" className="scroll-mt-24">
            <SectionHeading id="cases">Cases</SectionHeading>
            <p className="text-sm text-slate-600 mb-6">
              All cases endpoints require an <InlineCode>Authorization: Bearer &lt;token&gt;</InlineCode> header.
            </p>

            {/* Case object */}
            <div className="mb-6">
              <SubHeading>Case Object</SubHeading>
              <ParamTable rows={[
                ['id',          'string',  '—',  'Auto-generated identifier, e.g. C-001'],
                ['title',       'string',  '—',  'Short summary of the issue'],
                ['description', 'string',  '—',  'Full details of the issue'],
                ['status',      'enum',    '—',  'Open | In Progress | Closed'],
                ['priority',    'enum',    '—',  'Low | Medium | High'],
                ['date',        'ISO date','—',  'Date the case was created'],
              ]} />
            </div>

            <Endpoint method="GET" path="/api/cases" description="Return a list of all cases, newest first.">
              <div>
                <SubHeading>Response — 200 OK</SubHeading>
                <Code>{`{
  "data": [
    {
      "id": "C-004",
      "title": "Dashboard chart renders empty",
      "description": "The line chart shows no data after refresh.",
      "status": "Open",
      "priority": "Medium",
      "date": "2026-06-05"
    },
    {
      "id": "C-003",
      "title": "Export PDF feature not working",
      "description": "PDF export throws a 500 error on large datasets.",
      "status": "Closed",
      "priority": "Low",
      "date": "2026-05-28"
    }
  ],
  "total": 2
}`}</Code>
              </div>
            </Endpoint>

            <Endpoint method="POST" path="/api/cases" description="Create a new case. The id and date are assigned by the server.">
              <div>
                <SubHeading>Request Body</SubHeading>
                <ParamTable rows={[
                  ['title',       'string', 'Yes', 'Short summary of the issue'],
                  ['description', 'string', 'No',  'Full details of the issue'],
                  ['status',      'enum',   'Yes', 'Open | In Progress | Closed'],
                  ['priority',    'enum',   'Yes', 'Low | Medium | High'],
                ]} />
                <Code>{`{
  "title": "Server outage in production",
  "description": "Production servers went down at 3am.",
  "status": "Open",
  "priority": "High"
}`}</Code>
              </div>
              <div>
                <SubHeading>Response — 201 Created</SubHeading>
                <Code>{`{
  "id": "C-005",
  "title": "Server outage in production",
  "description": "Production servers went down at 3am.",
  "status": "Open",
  "priority": "High",
  "date": "2026-06-07"
}`}</Code>
              </div>
            </Endpoint>

            <Endpoint method="GET" path="/api/cases/:id" description="Return a single case by its ID.">
              <div>
                <SubHeading>Path Parameters</SubHeading>
                <ParamTable rows={[
                  ['id', 'string', 'Yes', 'The case ID, e.g. C-001'],
                ]} />
              </div>
              <div>
                <SubHeading>Response — 200 OK</SubHeading>
                <Code>{`{
  "id": "C-001",
  "title": "Server outage in production",
  "description": "Production servers went down at 3am.",
  "status": "Open",
  "priority": "High",
  "date": "2026-06-01"
}`}</Code>
              </div>
            </Endpoint>

            <Endpoint method="PUT" path="/api/cases/:id" description="Update an existing case. Only include the fields you want to change.">
              <div>
                <SubHeading>Path Parameters</SubHeading>
                <ParamTable rows={[
                  ['id', 'string', 'Yes', 'The case ID, e.g. C-001'],
                ]} />
              </div>
              <div>
                <SubHeading>Request Body</SubHeading>
                <ParamTable rows={[
                  ['title',       'string', 'No', 'Updated title'],
                  ['description', 'string', 'No', 'Updated description'],
                  ['status',      'enum',   'No', 'Open | In Progress | Closed'],
                  ['priority',    'enum',   'No', 'Low | Medium | High'],
                ]} />
                <Code>{`{
  "status": "In Progress",
  "priority": "High"
}`}</Code>
              </div>
              <div>
                <SubHeading>Response — 200 OK</SubHeading>
                <Code>{`{
  "id": "C-001",
  "title": "Server outage in production",
  "description": "Production servers went down at 3am.",
  "status": "In Progress",
  "priority": "High",
  "date": "2026-06-01"
}`}</Code>
              </div>
            </Endpoint>

            <Endpoint method="DELETE" path="/api/cases/:id" description="Permanently delete a case.">
              <div>
                <SubHeading>Path Parameters</SubHeading>
                <ParamTable rows={[
                  ['id', 'string', 'Yes', 'The case ID, e.g. C-001'],
                ]} />
              </div>
              <div>
                <SubHeading>Response — 204 No Content</SubHeading>
                <Code>{`(empty body)`}</Code>
              </div>
            </Endpoint>
          </section>

          {/* Errors */}
          <section id="errors" className="scroll-mt-24">
            <SectionHeading id="errors">Error Reference</SectionHeading>
            <p className="text-sm text-slate-600 mb-4">
              All errors return a JSON body with a <InlineCode>code</InlineCode> and a human-readable <InlineCode>message</InlineCode>.
            </p>

            <div className="mb-4">
              <SubHeading>Error Response Shape</SubHeading>
              <Code>{`{
  "code": "NOT_FOUND",
  "message": "Case C-999 does not exist."
}`}</Code>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['HTTP Status', 'Code', 'When it occurs'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['400', 'VALIDATION_ERROR',    'A required field is missing or has an invalid value.'],
                    ['401', 'UNAUTHORIZED',         'No token provided or the token is invalid / expired.'],
                    ['403', 'FORBIDDEN',            'The authenticated user does not have permission.'],
                    ['404', 'NOT_FOUND',            'The requested resource does not exist.'],
                    ['409', 'CONFLICT',             'The request conflicts with the current state.'],
                    ['500', 'INTERNAL_SERVER_ERROR','An unexpected server error occurred.'],
                  ].map(([status, code, desc]) => (
                    <tr key={code}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{status}</td>
                      <td className="px-4 py-3 font-mono text-xs text-red-600">{code}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
